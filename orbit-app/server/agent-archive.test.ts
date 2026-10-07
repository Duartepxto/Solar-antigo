import { beforeEach, expect, it, vi } from 'vitest';
import { rmSync } from 'node:fs';
import { DATA_DIR } from './config.ts';
import { Store } from './store.ts';
import { exportAgentArchive, importAgentArchive, previewAgentArchive } from './agent-archive.ts';
import { parseAgentArchive } from '../shared/agent-archive.ts';
import { readMemoryFile, readMemoryTopic, writeMemoryFile, writeMemoryTopic, writeMemoryLog } from './workspace.ts';

const selection = () => ({ instanceId: 'codex', model: 'gpt-6-luna' });
beforeEach(() => rmSync(DATA_DIR, { recursive: true, force: true }));

it('moves only the selected planet with stable identity, complete memory and history, excluding local grants and sessions', () => {
  const store = new Store(selection), agent = store.createBot({ name: 'Momo', soul: 'Continue the Solar project' });
  const other = store.createBot({ name: 'Private other agent' });
  store.appendMessage(other.threadId, { role: 'user', kind: 'text', text: 'OTHER_PRIVATE_TEXT' });
  store.appendMessage(agent.threadId, { role: 'user', kind: 'text', text: 'Continue from commit abc123' });
  store.patchBot(agent.id, { computer: 'local', browser: true, approvalMode: 'full', resumeCursors: { codex: 'PRIVATE_SESSION' } });
  writeMemoryFile(agent.id, 'The owner prefers particle connections');
  writeMemoryTopic(agent.id, 'project.md', 'Next: Android');
  writeMemoryLog(agent.id, '2026-10-07.md', 'Built the app');
  const file = exportAgentArchive(store, agent.id), id = agent.id, thread = agent.threadId;
  expect(JSON.stringify(file)).not.toMatch(/OTHER_PRIVATE_TEXT|PRIVATE_SESSION/);
  expect(file.backup.bots).toHaveLength(1);
  store.deleteBot(id);
  const preview = previewAgentArchive(store, file);
  importAgentArchive(store, file, preview.expectedState, selection());
  expect(store.bot(id)).toMatchObject({ id, name: 'Momo', soul: 'Continue the Solar project', computer: 'off', browser: false, approvalMode: 'ask', resumeCursors: {} });
  expect(readMemoryFile(id).text).toContain('particle connections');
  expect(readMemoryTopic(id, 'project.md')).toBe('Next: Android');
  expect(store.messagesFor(thread).some(message => message.text === 'Continue from commit abc123')).toBe(true);
  expect(store.bot(other.id)?.name).toBe('Private other agent');
  expect(new Store(selection).bot(id)?.threadId).toBe(thread);
});

it('updates the same planet without duplicates or lost local conversation branches, keeping local model and tools', () => {
  const store = new Store(selection), agent = store.createBot({ name: 'Momo' });
  const first = store.appendMessage(agent.threadId, { role: 'user', kind: 'text', text: 'First' });
  writeMemoryFile(agent.id, 'Imported memory');
  const file = exportAgentArchive(store, agent.id);
  store.appendMessage(agent.threadId, { role: 'bot', kind: 'text', text: 'Local work after export' });
  writeMemoryFile(agent.id, 'Local memory');
  store.patchBot(agent.id, { computer: 'local', browser: true });
  const originalCount = store.messagesFor(agent.threadId).length;
  const preview = previewAgentArchive(store, file);
  importAgentArchive(store, file, preview.expectedState, selection());
  expect(store.bots).toHaveLength(1);
  expect(store.messagesFor(agent.threadId).map(message => message.text)).toContain('Local work after export');
  expect(store.activeLeaf(agent.threadId)).toBe(first.id);
  expect(store.bot(agent.id)).toMatchObject({ computer: 'local', browser: true });
  expect(readMemoryFile(agent.id).text).toBe('Imported memory');
  importAgentArchive(store, file, previewAgentArchive(store, file).expectedState, selection());
  expect(store.messagesFor(agent.threadId)).toHaveLength(originalCount);
});

it('refuses stale previews, running agents, foreign thread identities and conflicting messages before changing memory', () => {
  const store = new Store(selection), agent = store.createBot({ name: 'Momo' });
  store.appendMessage(agent.threadId, { role: 'user', kind: 'text', text: 'Original' });
  writeMemoryFile(agent.id, 'Keep me');
  const file = exportAgentArchive(store, agent.id), preview = previewAgentArchive(store, file);
  writeMemoryFile(agent.id, 'Newer memory');
  expect(() => importAgentArchive(store, file, preview.expectedState, selection())).toThrow(/changed after preview/);
  const conflicting = structuredClone(file); conflicting.backup.bots[0].tasks[0].messages[0].text = 'Different';
  expect(() => importAgentArchive(store, conflicting, previewAgentArchive(store, conflicting).expectedState, selection())).toThrow(/conflict/);
  expect(readMemoryFile(agent.id).text).toBe('Newer memory');
  const other = store.createBot({ name: 'Other' });
  const foreign = structuredClone(file);
  foreign.backup.bots[0].tasks[0].key = other.threadId;
  foreign.backup.bots[0].activeTask = other.threadId;
  expect(() => importAgentArchive(store, foreign, previewAgentArchive(store, foreign).expectedState, selection())).toThrow(/another agent/);
  store.patchBot(agent.id, { busy: true });
  expect(() => importAgentArchive(store, file, previewAgentArchive(store, file).expectedState, selection())).toThrow(/Stop/);
});

it('rolls back a failed update to profile, memory and conversations', () => {
  const store = new Store(selection), agent = store.createBot({ name: 'Momo' });
  writeMemoryFile(agent.id, 'Before');
  const file = exportAgentArchive(store, agent.id); file.backup.bots[0].memory!.file = 'After';
  const original = store.patchBotProfile.bind(store);
  const spy = vi.spyOn(store, 'patchBotProfile').mockImplementationOnce(() => { throw new Error('fixture write failure'); }).mockImplementation(original);
  expect(() => importAgentArchive(store, file, previewAgentArchive(store, file).expectedState, selection())).toThrow('fixture write failure');
  spy.mockRestore();
  expect(readMemoryFile(agent.id).text).toBe('Before');
  expect(new Store(selection).bot(agent.id)?.name).toBe('Momo');
});

it('rejects multi-agent files, path traversal and oversized memory', () => {
  const store = new Store(selection), agent = store.createBot({ name: 'Momo' });
  const file = exportAgentArchive(store, agent.id);
  const duplicate = structuredClone(file); duplicate.backup.bots.push(structuredClone(duplicate.backup.bots[0]));
  expect(() => parseAgentArchive(duplicate)).toThrow();
  file.backup.bots[0].memory = { file: '', logs: [], topics: [{ name: '../escape.md', text: 'no' }] };
  expect(() => parseAgentArchive(file)).toThrow();
  file.backup.bots[0].memory = { file: 'x'.repeat(256 * 1024 + 1), logs: [], topics: [] };
  expect(() => parseAgentArchive(file)).toThrow();
});
