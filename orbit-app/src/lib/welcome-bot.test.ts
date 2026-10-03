import { expect, it, vi } from 'vitest';
import { saveWelcomeBot } from './welcome-bot';
import type { Bot } from '@/state/store';
it('creates and returns the first agent instead of silently finishing an empty roster', async () => {
  const request = vi.fn().mockResolvedValue({ bot: { id: 'created', name: 'Luna' } });
  expect(await saveWelcomeBot(null, ' Luna ', 'blue', ' Help me code ', request)).toMatchObject({ id: 'created' });
  expect(request.mock.calls[0][0]).toBe('/api/bots');
  expect(request.mock.calls[0][1].method).toBe('POST');
  expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ name: 'Luna', settings: { name: 'Luna', soul: 'Help me code', color: 'blue' } });
});
it('edits the existing agent without discarding its instructions', async () => {
  const request = vi.fn().mockResolvedValue({ bot: { id: 'existing' } });
  await saveWelcomeBot({ id: 'existing', name: 'Luna', soul: 'Existing instructions' } as Bot, '', 'blue', 'New instructions', request);
  expect(request.mock.calls[0][0]).toBe('/api/bots/existing');
  expect(JSON.parse(request.mock.calls[0][1].body).soul).toBe('Existing instructions\n\nNew instructions');
});
it('does not return a saved agent when creation fails or the server omits it', async () => {
  await expect(saveWelcomeBot(null,'Luna','blue','',vi.fn().mockRejectedValue(new Error('offline')))).rejects.toThrow('offline');
  await expect(saveWelcomeBot(null,'Luna','blue','',vi.fn().mockResolvedValue({}))).rejects.toThrow('not saved');
});
