import { api, type Bot } from '@/state/store';

/** First run creates a real agent when there is no seeded agent to edit. */
export async function saveWelcomeBot(bot: Bot | null, name: string, color: string, line: string, request: typeof api = api): Promise<Bot> {
  const instruction = line.trim();
  const soul = instruction ? [bot?.soul?.trimEnd(), instruction].filter(Boolean).join('\n\n') : undefined;
  const fields = { name: name.trim() || bot?.name || 'Assistant', color, ...(soul === undefined ? {} : { soul }) };
  const result = await request(bot ? `/api/bots/${encodeURIComponent(bot.id)}` : '/api/bots', {
    method: bot ? 'PATCH' : 'POST', body: JSON.stringify(bot ? fields : { name: fields.name, settings: fields }),
  });
  if (!result.bot?.id) throw new Error('The agent was not saved.');
  return result.bot;
}
