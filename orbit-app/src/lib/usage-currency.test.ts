import { beforeEach, describe, expect, it } from 'vitest';
import { ECB_USAGE_CURRENCY_SEED } from '../../shared/usage-currency';
import { setLocale } from './i18n';
import { currentUsageCurrency, displayEuro, euroToUsd, formatCost, formatEuro, setUsageCurrency, usageCurrencyNote } from './usage-currency';
import { sumUsage, usageCostLabel } from './usage';

beforeEach(() => { setLocale('en'); setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED }); });
describe('EUR usage amounts', () => {
  it('converts in the ECB direction and reverses EUR edits without a 1:1 assumption', () => {
    expect(displayEuro(1.1186)).toBe(1);
    expect(euroToUsd(1)).toBe(1.1186);
    expect(formatCost(1.1186)).toBe('€1.00');
    expect(displayEuro(1, null)).toBeNull();
    expect(formatCost(Number.NaN)).toBe('—');
  });
  it('distinguishes tiny positive usage, known zero and unknown', () => {
    expect(formatCost(0)).toBe('€0.00');
    expect(formatCost(.004)).toBe('€0.0036');
    expect(formatCost(.0000001)).toBe('<€0.0001');
    expect(usageCostLabel({ costUsd: null })).toBe('—');
    expect(usageCostLabel({ costUsd: 1.1186, estimatedUsd: 1.1186, unpriced: 2 })).toBe('~€1.00*');
  });
  it('uses the language currency format and retains the quote source/date', () => {
    setLocale('pt-br');
    expect(formatEuro(12.34)).toContain('12,34');
    expect(formatEuro(12.34)).toContain('€');
    expect(usageCurrencyNote()).toContain('2026-10-08');
    expect(usageCurrencyNote()).toContain('1.1186');
  });
  it('rejects malformed or older quotes without discarding a valid reference', () => {
    setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED, date: '2026-02-30' });
    setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED, usdPerEur: 0 });
    setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED, date: '2026-10-07' });
    expect(currentUsageCurrency()?.date).toBe('2026-10-08');
    expect(displayEuro(1.1186)).toBe(1);
  });
  it('keeps estimated and unknown coverage while aggregating current tasks', () => {
    const total = sumUsage([
      { input: 10, output: 2, turns: 1, costUsd: 1.1186, estimatedUsd: 1.1186, costSource: 'estimated', unpriced: 0 },
      { input: 4, output: 3, turns: 2, costUsd: null, unpriced: 2 },
    ]);
    expect(total.estimatedUsd).toBe(1.1186);
    expect(total.unpriced).toBe(2);
    expect(total.costSource).toBe('estimated');
    expect(usageCostLabel(total)).toBe('~€1.00*');
  });
});
