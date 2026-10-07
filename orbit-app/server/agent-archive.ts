import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { parseAgentArchive, type AgentArchive } from '../shared/agent-archive.ts';
import type { ModelSelection } from './contracts.ts';
import { DATA_DIR } from './config.ts';
import { writeFileAtomic } from './atomic.ts';
import { deleteThread, removeMemoryFile } from './message-db.ts';
import { redactSecretsInText } from './redact.ts';
import type { Store, Message, TaskRecord } from './store.ts';
import { createTeamBackup, messageText } from './team-backup.ts';
import { listMemoryTopics, listMemoryLogs, workspaceDir, writeMemoryFile, writeMemoryTopic, writeMemoryLog, syncMemoryIndex } from './workspace.ts';

export class AgentArchiveError extends Error {
  readonly status: number;
  constructor(message: string, status = 409) { super(message); this.status = status; }
}

export function exportAgentArchive(store: Store, botId: string): AgentArchive {
  const bot = store.bot(botId);
  if (!bot || bot.system) throw new AgentArchiveError('Choose a personal agent to export', 404);
  return parseAgentArchive({ format: 'solar.agent', version: 1, backup: createTeamBackup(store, [], bot.name, botId) });
}

function memoryFiles(botId: string): Map<string, string> {
  const paths = ['MEMORY.md', ...listMemoryTopics(botId).map(topic => `memory/${topic.name}`), ...listMemoryLogs(botId).map(name => `memory/log/${name}`)];
  return new Map(paths.flatMap(path => {
    const file = join(workspaceDir(botId), path);
    return existsSync(file) ? [[path, readFileSync(file, 'utf8')] as const] : [];
  }));
}

function fingerprint(store: Store, id: string): string {
  const bot = store.bot(id);
  return bot ? createHash('sha256').update(JSON.stringify({ bot, memory: [...memoryFiles(id)],
    transcripts: store.tasks(id).map(task => [task.threadId, store.messagesFor(task.threadId), store.activeLeaf(task.threadId)]) })).digest('hex') : 'new';
}

export function previewAgentArchive(store: Store, input: unknown) {
  const archive = parseAgentArchive(input), source = archive.backup.bots[0];
  const existing = store.bot(source.key);
  if (existing?.system) throw new AgentArchiveError('The built-in assistant cannot be replaced');
  return { botId: source.key, name: source.name, existing: Boolean(existing), expectedState: fingerprint(store, source.key),
    conversations: source.tasks.length, messages: source.tasks.reduce((sum, task) => sum + task.messages.length, 0),
    memoryDocuments: source.memory ? 1 + source.memory.topics.length + source.memory.logs.length : 0,
    exportedAt: archive.backup.exportedAt };
}

/** Explicit, synchronous import. Local tools/accounts stay local; transcripts
 * merge by identity, while the reviewed memory snapshot replaces memory only.
 * A private recovery file and rollback protect existing data on write failure. */
export function importAgentArchive(store: Store, input: unknown, expectedState: string, selection: ModelSelection) {
  const archive = parseAgentArchive(input), source = archive.backup.bots[0];
  const preview = previewAgentArchive(store, archive);
  if (preview.expectedState !== expectedState) throw new AgentArchiveError('The agent changed after preview. Review the file again.');
  const existing = store.bot(source.key);
  if (existing?.busy || existing?.tasks?.some(task => task.busy)) throw new AgentArchiveError('Stop the agent before importing');
  const original = existing ? structuredClone(existing) : null;
  const oldMemory = existing ? memoryFiles(existing.id) : new Map<string, string>();
  const oldThreads = new Map((existing?.tasks ?? []).map(task => [task.threadId, {
    messages: structuredClone(store.messagesFor(task.threadId)), leaf: store.activeLeaf(task.threadId),
  }]));
  const currentModel = existing ? store.projectBotForTask(existing.id, existing.threadId)!.modelSelection : selection;
  // Validate every conversation before the first write, including global id collisions.
  const prepared = source.tasks.map(task => {
    const owner = store.botByThread(task.key);
    if (owner && owner.id !== source.key || store.groupByThread(task.key)) throw new AgentArchiveError('Conversation identity belongs to another agent');
    const current = oldThreads.get(task.key)?.messages ?? [];
    const ids = new Map(current.map(message => [message.id, message]));
    const merged = [...current];
    for (const message of task.messages) {
      const prior = ids.get(message.id);
      if (prior) {
        if (prior.role !== message.role || redactSecretsInText(messageText(prior)) !== redactSecretsInText(message.text) || (prior.parentId ?? null) !== message.parentId) {
          throw new AgentArchiveError('Conversation versions conflict. Existing data was not changed.');
        }
      } else {
        const restored: Message = { id: message.id, role: message.role, kind: 'text', text: redactSecretsInText(message.text),
          at: message.at, parentId: message.parentId, replyToId: message.replyToId };
        merged.push(restored); ids.set(restored.id, restored);
      }
    }
    return { task, merged };
  });
  let safetyPath: string | undefined;
  if (original) {
    const dir = join(DATA_DIR, '.agent-transfers'); mkdirSync(dir, { recursive: true, mode: 0o700 });
    safetyPath = join(dir, `${source.key}-${randomUUID()}.json`);
    writeFileAtomic(safetyPath, JSON.stringify({ bot: original, memory: [...oldMemory], threads: [...oldThreads] }), { mode: 0o600 });
  }
  let target = existing;
  try {
    target ??= store.createBot({ name: source.name, title: source.title, description: source.description, soul: source.soul,
      color: source.color, modelSelection: currentModel }, { seedMessages: false, restoredId: source.key });
    if (!original) store.patchBot(target.id, { computer: 'off', browser: false, approvalMode: 'ask', autoApprove: false });
    const tasks = [...(original?.tasks ?? [])];
    for (const { task, merged } of prepared) {
      const local = tasks.find(item => item.threadId === task.key);
      const record: TaskRecord = { ...local, threadId: task.key, title: task.title, createdAt: task.createdAt,
        updatedAt: merged.reduce((latest, message) => Math.max(latest, message.at), task.createdAt), modelSelection: local?.modelSelection ?? structuredClone(currentModel),
        resumeCursors: {}, handedMessages: {}, busy: false, activity: 'idle', unread: false,
        contextFloor: undefined, appliedCompactionId: undefined, lastContextModel: undefined, lastInstanceId: undefined,
        titleFromFirstMessage: task.titleFromFirstMessage, pinned: task.pinned };
      if (local) tasks[tasks.indexOf(local)] = record; else tasks.push(record);
    }
    store.patchBot(target.id, { tasks, threadId: source.activeTask, resumeCursors: {} });
    for (const { task, merged } of prepared) store.replacePortableTranscript(target.id, task.key, merged, task.activeLeafId);
    const incoming = new Map<string, string>();
    if (source.memory) {
      incoming.set('MEMORY.md', source.memory.file);
      for (const topic of source.memory.topics) incoming.set(`memory/${topic.name}`, topic.text);
      for (const log of source.memory.logs) incoming.set(`memory/log/${log.name}`, log.text);
    }
    for (const path of memoryFiles(target.id).keys()) if (!incoming.has(path)) {
      unlinkSync(join(workspaceDir(target.id), path)); removeMemoryFile(target.id, path);
    }
    for (const [path, text] of incoming) {
      if (path === 'MEMORY.md') writeMemoryFile(target.id, text);
      else if (path.startsWith('memory/log/')) writeMemoryLog(target.id, path.slice(11), text);
      else writeMemoryTopic(target.id, path.slice(7), text);
    }
    syncMemoryIndex(target.id);
    store.patchBotProfile(target.id, { name: source.name, title: source.title, description: source.description, soul: source.soul ?? '' });
    store.switchTask(target.id, source.activeTask);
    return { botId: target.id, name: target.name, updated: Boolean(original), safetyCopy: Boolean(safetyPath) };
  } catch (error) {
    if (!original) { if (store.bot(source.key)) store.deleteBot(source.key); }
    else {
      try {
        for (const { task } of prepared) if (!oldThreads.has(task.key)) deleteThread(task.key);
        store.patchBot(source.key, original);
        for (const [id, thread] of oldThreads) store.replacePortableTranscript(source.key, id, thread.messages, thread.leaf);
        for (const path of memoryFiles(source.key).keys()) if (!oldMemory.has(path)) { unlinkSync(join(workspaceDir(source.key), path)); removeMemoryFile(source.key, path); }
        for (const [path, text] of oldMemory) writeFileAtomic(join(workspaceDir(source.key), path), text, { mode: 0o600 });
        syncMemoryIndex(source.key);
        store.patchBot(source.key, original);
        store.patchBotProfile(source.key, { soul: original.soul ?? '', name: original.name, title: original.title, description: original.description });
        store.switchTask(source.key, original.threadId);
      } catch (recoveryError) { throw new AgentArchiveError(`Import recovery needs attention: ${String(recoveryError)}. Original error: ${String(error)}. Safety copy: ${safetyPath}`, 500); }
    }
    throw error;
  }
}
