/** Microphone recording stays continuous; only recognition windows are bounded. */
export function appendSolarTranscript(previous: string, next: string, options: { overlap?: boolean } = {}): string {
  const left = previous.trim(), right = next.trim();
  if (!left || !right) return left || right;
  const a = left.split(/\s+/), b = right.split(/\s+/);
  const key = (word: string) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  let shared = 0;
  if (options.overlap) for (let count = Math.min(16, a.length, b.length); count > 0; count--) {
    if (a.slice(-count).every((word, index) => key(word) && key(word) === key(b[index]))) { shared = count; break; }
  }
  return [left, b.slice(shared).join(' ')].filter(Boolean).join(' ');
}

function tail(chunks: Float32Array[], samples: number): Float32Array[] {
  const result: Float32Array[] = [];
  for (let i = chunks.length - 1; i >= 0 && samples > 0; i--) {
    const chunk = chunks[i];
    result.unshift(chunk.length <= samples ? chunk : chunk.slice(chunk.length - samples));
    samples -= Math.min(samples, chunk.length);
  }
  return result;
}

export function createSolarDictationStream(options: {
  rate: number;
  current: () => boolean;
  recognize: (audio: Float32Array[], preview: boolean) => Promise<string>;
  partial: (text: string) => void;
  error: (error: unknown) => void;
}) {
  const { rate } = options;
  let chunks: Float32Array[] = [], samples = 0, total = 0, lastPreview = 0;
  let lastVoice = 0, spoke = false, overlap = false, windowId = 0;
  let previewPending = false, finishing = false, failed = false;
  let committed = '', pipeline = Promise.resolve();
  const current = () => options.current() && !failed;

  const queue = (audio: Float32Array[], preview: boolean, id: number, overlapping: boolean) => {
    if (preview) previewPending = true;
    // Serialize decoder requests. Starting a second process would return 429
    // and interrupt the draft; capture keeps running while this queue works.
    pipeline = pipeline.then(async () => {
      try {
        if (!current() || (preview && (finishing || id !== windowId))) return;
        const words = (await options.recognize(audio, preview)).trim();
        if (!current()) return;
        if (preview) {
          if (id === windowId && !finishing && words) options.partial(appendSolarTranscript(committed, words, { overlap: overlapping }));
        } else {
          committed = appendSolarTranscript(committed, words, { overlap: overlapping });
          if (committed && !finishing) options.partial(committed);
        }
      } catch (error) {
        if (current()) { failed = true; options.error(error); }
      } finally { if (preview) previewPending = false; }
    });
  };

  const commit = (carrySpeech: boolean) => {
    if (spoke && samples) queue(chunks.slice(), false, windowId, overlap);
    chunks = carrySpeech && spoke ? tail(chunks, Math.round(rate * 1.2)) : [];
    samples = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    overlap = chunks.length > 0;
    spoke = overlap;
    windowId++;
    lastPreview = total;
  };

  return {
    push(captured: Float32Array, now: number) {
      if (finishing || !current()) return;
      chunks.push(captured); samples += captured.length; total += captured.length;
      let power = 0;
      for (const sample of captured) power += sample * sample;
      // Quiet speech still reaches recognition. The gate only schedules
      // windows; it never stops capture, unlike the old 1.8-second endpoint.
      if (Math.sqrt(power / captured.length) > .003) { spoke = true; lastVoice = now; }
      // Keep enough sentence context for language detection and avoid
      // launching the larger final model for every brief hesitation.
      if (spoke && now - lastVoice > 800 && samples >= rate * 8) commit(false);
      else if (samples >= rate * 24) commit(true);
      else if (spoke && total - lastPreview >= rate * 4 && !previewPending) {
        lastPreview = total; queue(chunks.slice(), true, windowId, overlap);
      } else if (!spoke && samples > rate * 1.2) {
        // Preserve a half second before the next word, without accumulating
        // unlimited silence or presenting empty audio to a generative model.
        chunks = tail(chunks, Math.round(rate * .5));
        samples = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      }
    },
    async finish() {
      finishing = true;
      if (spoke && samples) queue(chunks.slice(), false, windowId, overlap);
      chunks = [];
      await pipeline;
      return { text: committed, failed };
    },
  };
}
