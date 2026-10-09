# Local dictation recognition

Solar's recording API still accepts canonical mono, 16 kHz, signed 16-bit PCM
WAV recordings of at most 29 seconds. A continuous dictation session submits
bounded clips; the backend does not extend the mobile call recording limit.

The installed runtime is the official whisper.cpp v1.9.0 Windows CPU build.
Recordings and transcripts live only in a disposable local directory, removed
on success, decoder failure and cancellation. No audio is sent to a service.

## Model preparation

Use the explicit model command once to install the optional accuracy model:

```powershell
node scripts/prepare-solar-speech.mjs --model small-q5_1
node scripts/prepare-solar-speech.mjs --model small-q5_1 --check
```

`--list` prints the pinned model catalogue without a download. The default
preparation still installs base. The optional file is included by Solar's
Windows packaging filter only when it exists, so existing base-only bundles
continue to work.

Both models are multilingual. The official source is the
[whisper.cpp model repository](https://huggingface.co/ggerganov/whisper.cpp/tree/5359861c739e955e79d9a303bcbc70fb988958b1),
pinned to revision `5359861c739e955e79d9a303bcbc70fb988958b1`. File sizes and
SHA-256 values are from that revision's Git LFS pointers.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| ggml-base.bin | 147951465 | 60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe |
| ggml-small-q5_1.bin | 190085487 | ae85e4a935d7a567bd102fe55afc16bb595bdb618e11b2fc7591bc08120411bb |

## Recognition behavior

- Preview requests (`preview: true`) prefer base and use greedy decoding,
  best-of one, with temperature fallback disabled. They favour responsiveness.
- Completed clips prefer the optional small model, with beam five and best-of
  five. Missing small falls back to base. Beam five was already the runtime's
  default; it is not presented as a new accuracy improvement.
- Both suppress non-speech tokens. Constant PCM, including silent zero samples
  and DC offsets, returns empty text without starting the decoder. There is no
  amplitude gate that would remove quiet spoken words.
- A single selected language is forwarded. Multiple selected languages keep
  `auto`; nothing hard-codes Portuguese or requests translation to English.
- Replies add `model` and `quality` alongside `text`. Status also reports the
  preview model and the recording limit. Quality names describe the selected
  profile, not a measured confidence score.

Decoder flags are documented in the
[runtime's exact CLI source](https://github.com/ggml-org/whisper.cpp/blob/v1.9.0/examples/cli/cli.cpp).
OpenAI's [model comparison](https://github.com/openai/whisper#available-models-and-languages)
explains the accuracy/speed tradeoff between base and small. Quantized small
is an expected quality improvement, not proof of improved recognition for a
particular microphone, accent or room.

## Verification and limits

`vitest run server/solar-speech.test.ts` uses synthetic PCM and a fake local
decoder in isolated directories. It checks multilingual model selection,
preview/final flags, unchanged language forwarding, silence handling,
preserved accented text and cleanup after failure. It never records the owner.

Both installed models were loaded by `whisper-bench.exe -m <model> -t 4 -ng`
on this computer, with the same v1.9.0 CPU runtime, four threads, no GPU and
flash attention enabled. The loader identified the small model as type 3,
Q5_1 (`ftype 9`), with 99 languages; it was not merely a matching filename.

| Synthetic benchmark stage | Base | Small Q5_1 |
| --- | ---: | ---: |
| Model load | 202 ms | 329 ms |
| Encoder, one window | 920 ms | 3736 ms |
| Decoder, per token | 4.13 ms | 8.96 ms |
| Total benchmark including repeated prompt/decode loops | 7.58 s | 21.33 s |

These are indicative benchmark stages, not full dictation latency. The small
encoder was approximately four times slower here, which is why previews use
base while capture continues. A direct CLI check with one second of synthetic
silent PCM and the small model also successfully accepted `-sns -bs 1 -bo 1
-nf`, creating its transcript in about 3.93 seconds. The production silence
guard bypasses that unnecessary work entirely.

No public speech fixture was present for an end-to-end word-accuracy check.
No microphone or personal recording was used. Portuguese accuracy and actual
microphone latency remain manual acceptance items; these timings promise
neither transcription accuracy nor realtime behavior on other computers.
