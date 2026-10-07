import { expect, it } from 'vitest';
import { launchVerificationServer, runControlOrbit } from '../scripts/control-orbit.ts';
import { request } from '../scripts/mcp-server.ts';

it('continues the same planet on a second isolated computer and updates it without copies', async () => {
  const source = await launchVerificationServer();
  let destination: Awaited<ReturnType<typeof launchVerificationServer>> | undefined;
  try {
    destination = await launchVerificationServer();
    const cli = (session: typeof source, ...args: string[]) => runControlOrbit(args, { env: { ORBIT_URL: session.info.url } }) as Promise<any>;
    const api = (session: typeof source, path: string, body?: unknown, method = 'POST') => request(path, body === undefined ? {} : { method, body: JSON.stringify(body) }, session.info.url) as Promise<any>;
    const agent = (await cli(source, 'new-bot', '--name', 'Planet continuity')).bot;
    await api(source, `/api/bots/${agent.id}/memory`, { text: 'Remember the Solar particle task and commit abc123' }, 'PUT');
    await cli(source, 'send', '--bot', agent.id, '--text', 'We finished particle transfers. Next: mobile.');
    expect((await cli(source, 'wait', '--bot', agent.id, '--timeout', '20')).status).toBe('settled');
    const { archive } = await api(source, `/api/bots/${agent.id}/agent-archive`);
    const preview = await api(destination, '/api/agent-archives/preview', { archive });
    expect(preview).toMatchObject({ existing: false, botId: agent.id });
    const imported = await api(destination, '/api/agent-archives/import', { archive, expectedState: preview.expectedState });
    expect(imported.botId).toBe(agent.id);
    expect((await api(destination, `/api/bots/${agent.id}/memory`)).text).toContain('commit abc123');
    await cli(destination, 'send', '--bot', agent.id, '--text', 'Continue from the saved work');
    expect((await cli(destination, 'wait', '--bot', agent.id, '--timeout', '20')).status).toBe('settled');
    const threadId = archive.backup.bots[0].activeTask;
    const before = await api(destination, `/api/threads/${threadId}/messages`);
    const repeated = await api(destination, '/api/agent-archives/preview', { archive });
    expect(repeated.existing).toBe(true);
    await api(destination, '/api/agent-archives/import', { archive, expectedState: repeated.expectedState });
    const after = await api(destination, `/api/threads/${threadId}/messages`);
    expect(after.messages.map((message: any) => message.id)).toEqual(before.messages.map((message: any) => message.id));
    expect((await api(destination, '/api/bots')).bots.filter((bot: any) => bot.id === agent.id)).toHaveLength(1);
    expect((await api(source, '/api/bots')).bots.some((bot: any) => bot.id === agent.id)).toBe(true);
  } finally { if (destination) await destination.close(); await source.close(); }
}, 120000);
