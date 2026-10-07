import { useEffect, useRef, useState } from 'react';
import type { Bot, Message } from '@/state/store';
import { formatTokens } from '@/lib/usage';
import { formatElapsed } from '@/lib/working-time';
import { t } from '@/lib/i18n';

const seen = new Set<string>();

/** Counts up once, the first time a reply settles; older replies just show the figure. */
function useRollUp(target: number, key: string) {
  const fresh = !seen.has(key);
  const [value, setValue] = useState(fresh ? 0 : target);
  const frame = useRef(0);
  useEffect(() => {
    seen.add(key);
    if (!fresh || matchMedia('(prefers-reduced-motion: reduce)').matches) { setValue(target); return; }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, key, fresh]);
  return value;
}

/** What the last turn cost and how long it took, under the reply it produced. */
export function SolarTurnMeta({ bot, message }: { bot: Bot; message: Message }) {
  const digest = message.turnId ? bot.messages.find(m => m.kind === 'digest' && m.digest?.turnId === message.turnId)?.digest : undefined;
  const last = bot.tasks?.find(task => task.threadId === bot.threadId)?.usage?.lastTurn;
  const usage = digest?.usage ?? last;
  const total = usage ? usage.input + usage.output : 0;
  const tokens = useRollUp(total, message.id);
  if (!usage || !total) return null;
  const parts = [t('jarvis.solar.turn.tokens', { tokens: formatTokens(tokens) })];
  if (digest?.durationMs) parts.push(formatElapsed(digest.durationMs));
  const calls = digest?.toolCalls ?? digest?.tools.length;
  if (calls) parts.push(t('jarvis.solar.turn.steps', { count: calls }));
  return <div className="solar-turn-meta" title={`${formatTokens(usage.input)} in · ${formatTokens(usage.output)} out`}>{parts.join(' · ')}</div>;
}
