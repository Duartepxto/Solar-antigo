import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import type { Bot, Message } from '@/state/store';
import { SolarTurnMeta } from './SolarTurnMeta';

const old: Message = { id: 'old', role: 'bot', kind: 'text', turnId: 'old-turn', at: 1 };
const newest: Message = { id: 'new', role: 'bot', kind: 'text', turnId: 'new-turn', at: 2 };
const bot = { threadId: 'thread', messages: [old, newest], tasks: [{ threadId: 'thread', usage: { input: 20, output: 5, turns: 1, costUsd: 11.186, lastTurn: { input: 20, output: 5, costUsd: 11.186, costSource: 'estimated' } } }] } as unknown as Bot;
it('never assigns the latest turn cost or tokens to an older reply without a digest', () => {
  expect(renderToStaticMarkup(createElement(SolarTurnMeta, { bot, message: old }))).toBe('');
  expect(renderToStaticMarkup(createElement(SolarTurnMeta, { bot, message: newest }))).toContain('~€10.00');
});
it('uses the matched recorded digest for an older response rather than the latest usage', () => {
  const digest: Message = { id: 'digest', role: 'bot', kind: 'digest', at: 3, digest: { turnId: 'old-turn', botId: 'bot', threadId: 'thread', at: 1, durationMs: 1000, tools: [], memory: [], reply: '', hookCoverage: 'none', usage: { input: 2, output: 1, costUsd: 1.1186, costSource: 'estimated' } } };
  const html = renderToStaticMarkup(createElement(SolarTurnMeta, { bot: { ...bot, messages: [old, digest, newest] }, message: old }));
  expect(html).toContain('~€1.00');
  expect(html).not.toContain('€10.00');
});
