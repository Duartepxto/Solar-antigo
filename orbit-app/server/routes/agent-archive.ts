import { AGENT_ARCHIVE_MAX_BYTES, parseAgentArchive } from '../../shared/agent-archive.ts';
import type { ModelSelection } from '../contracts.ts';
import type { Store } from '../store.ts';
import { AgentArchiveError, exportAgentArchive, importAgentArchive, previewAgentArchive } from '../agent-archive.ts';
import { PASS, type RouteHandler } from './table.ts';

export function createAgentArchiveRoutes(deps: { store: Store; busy(id: string): boolean; selection(contextId?: string): Promise<ModelSelection> }): RouteHandler {
  return async ({ req, res, path, method, auth, json, readBody }) => {
    const exportMatch = path.match(/^\/api\/bots\/([\w-]+)\/agent-archive$/);
    if (!(exportMatch && method === 'GET') && !['/api/agent-archives/preview', '/api/agent-archives/import'].includes(path)) return PASS;
    if (auth.kind === 'loopback' ? auth.trust === 'service' : !auth.scopes.includes('admin')) { json(res, 403, { error: 'Workspace owner access required' }); return; }
    try {
      if (exportMatch) {
        if (deps.busy(exportMatch[1])) throw new AgentArchiveError('Wait for the agent to finish before exporting');
        res.setHeader('Cache-Control', 'no-store');
        json(res, 200, { archive: exportAgentArchive(deps.store, exportMatch[1]) }); return;
      }
      if (method !== 'POST') { json(res, 405, { error: 'Use POST' }); return; }
      const body = await readBody(req, AGENT_ARCHIVE_MAX_BYTES + 16384);
      const archive = parseAgentArchive(body?.archive);
      const id = archive.backup.bots[0].key;
      if (deps.busy(id)) throw new AgentArchiveError('Wait for the agent to finish before importing');
      if (path.endsWith('/preview')) { json(res, 200, previewAgentArchive(deps.store, archive)); return; }
      if (typeof body.expectedState !== 'string') throw new AgentArchiveError('Preview the file before importing', 400);
      const selection = await deps.selection(typeof body.contextBotId === 'string' ? body.contextBotId : undefined);
      if (deps.busy(id)) throw new AgentArchiveError('Wait for the agent to finish before importing');
      json(res, 200, importAgentArchive(deps.store, archive, body.expectedState, selection));
    } catch (error) {
      json(res, error instanceof AgentArchiveError ? error.status : 400, { error: error instanceof Error ? error.message : String(error) });
    }
  };
}
