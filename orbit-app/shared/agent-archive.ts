import { parseTeamBackup, MAX_TEAM_BACKUP_BYTES, type TeamBackup } from './team-backup.ts';

export const AGENT_ARCHIVE_MAX_BYTES = MAX_TEAM_BACKUP_BYTES;
export interface AgentArchive { format: 'solar.agent'; version: 1; backup: TeamBackup }

export function parseAgentArchive(input: unknown): AgentArchive {
  if (!input || typeof input !== 'object') throw new Error('Invalid Solar agent file');
  const value = input as AgentArchive;
  if (value.format !== 'solar.agent' || value.version !== 1) throw new Error('Choose a Solar agent file');
  if (new TextEncoder().encode(JSON.stringify(input)).byteLength > AGENT_ARCHIVE_MAX_BYTES) throw new Error('Agent file exceeds 50 MB');
  const backup = parseTeamBackup(value.backup);
  if (backup.bots.length !== 1 || backup.groups.length || backup.routines.length) throw new Error('Agent file must contain exactly one agent');
  const source = backup.bots[0];
  if (![source.key, ...source.tasks.map(task => task.key)].every(id => /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))) throw new Error('Invalid agent identity');
  const memory = source.memory;
  if (memory) {
    const paths = [...memory.topics.map(item => item.name.toLowerCase()), ...memory.logs.map(item => `log/${item.name}`)];
    if (new Set(paths).size !== paths.length) throw new Error('Invalid duplicate memory files');
    if ([memory.file, ...memory.topics.map(item => item.text), ...memory.logs.map(item => item.text)].some(text => new TextEncoder().encode(text).byteLength > 256 * 1024)) throw new Error('Memory document exceeds 256 KB');
  }
  return { format: 'solar.agent', version: 1, backup };
}
