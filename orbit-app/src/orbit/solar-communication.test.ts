import { expect, it } from 'vitest';
import { createSolarTransferReceiver, type SolarTransfer } from './solar-communication';

it('shows both directions even when a task completes between map polls, without replaying duplicates', () => {
  const bursts: SolarTransfer[] = [];
  const receive = createSolarTransferReceiver(frame => bursts.push(frame), () => 1200);
  const request = { id: 'task:request', from: 'jarvis', to: 'momo', at: 1000, result: false };
  const result = { id: 'task:result', from: 'momo', to: 'jarvis', at: 1100, result: true };
  receive(request); receive(result); receive(request); receive(result);
  expect(bursts).toEqual([request, result]);
});

it('ignores historical reconnect events and invalid destinations', () => {
  const bursts: SolarTransfer[] = [];
  const receive = createSolarTransferReceiver(frame => bursts.push(frame), () => 20000);
  const frame = { id: 'old', from: 'jarvis', to: 'momo', at: 1000, result: false };
  receive(frame); receive({ ...frame, at: 20000, to: 'jarvis' });
  expect(bursts).toEqual([]);
});
