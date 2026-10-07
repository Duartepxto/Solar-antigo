export interface SolarTransfer { id: string; from: string; to: string; at: number; result: boolean }

/** Live communication only: reconnects must not replay old particle bursts. */
export function createSolarTransferReceiver(deliver: (transfer: SolarTransfer) => void, now = Date.now) {
  const seen = new Set<string>();
  return (transfer: SolarTransfer) => {
    if (!transfer.id || !transfer.from || !transfer.to || transfer.from === transfer.to ||
      !Number.isFinite(transfer.at) || now() - transfer.at > 10_000 || seen.has(transfer.id)) return;
    seen.add(transfer.id);
    if (seen.size > 512) seen.delete(seen.values().next().value!);
    deliver(transfer);
  };
}
