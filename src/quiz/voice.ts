export type VoiceSettings = {
  enabled: boolean;
  autoSpeak: boolean;
  rate: number;
  pitch: number;
  volume: number;
  lang: string; // prefer ar-EG
};

export const DEFAULT_VOICE: VoiceSettings = {
  enabled: true,
  autoSpeak: true,
  rate: 1.02,
  pitch: 1.05,
  volume: 1,
  lang: "ar-EG",
};

export function speakEgyptian(text: string, settings: VoiceSettings) {
  try {
    if (!settings.enabled) return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    // Some browsers need voices warmed up.
    const voices = synth.getVoices?.() ?? [];
    const pick =
      voices.find((v) => (v.lang || "").toLowerCase() === "ar-eg") ||
      voices.find((v) => (v.lang || "").toLowerCase().startsWith("ar")) ||
      voices[0];

    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = pick?.lang || settings.lang;
    if (pick) u.voice = pick;
    u.rate = settings.rate;
    u.pitch = settings.pitch;
    u.volume = settings.volume;
    synth.speak(u);
  } catch {
    // ignore
  }
}

export function stopSpeak() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // ignore
  }
}
