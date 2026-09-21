export type TypingSoundKind = "key" | "backspace" | "error";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) return null;
  audioContext ??= new AudioContextConstructor();
  return audioContext;
}

export function playTypingSound(kind: TypingSoundKind = "key") {
  const context = getAudioContext();
  if (!context) return;
  if (context.state === "suspended") void context.resume();

  const duration = kind === "error" ? 0.055 : 0.035;
  const sampleCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    const envelope = 1 - index / sampleCount;
    channel[index] = (Math.random() * 2 - 1) * envelope * envelope;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = kind === "error" ? "lowpass" : "bandpass";
  filter.frequency.value = kind === "error" ? 520 : kind === "backspace" ? 1250 : 1850 + Math.random() * 220;
  filter.Q.value = kind === "error" ? 0.8 : 1.2;
  gain.gain.value = kind === "error" ? 0.24 : kind === "backspace" ? 0.19 : 0.17;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start();
  source.stop(context.currentTime + duration);
}
