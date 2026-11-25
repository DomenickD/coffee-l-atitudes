"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AmbientAudioToggleProps {
  compact?: boolean;
}

/**
 * Plays /media/ambient-cafe.mp3 when present; seamlessly falls back to a warm
 * Web Audio API procedural café/rainforest pink-noise + soft harmonic bed
 * so zero external audio files are required.
 */
export function AmbientAudioToggle({ compact = false }: AmbientAudioToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"idle" | "mp3" | "synth">("idle");

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const stopSynth = useCallback(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.setTargetAtTime(
          0.0001,
          audioCtxRef.current.currentTime,
          0.15
        );
      } catch {
        // Ignore ramp error
      }
    }
    if (audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      audioCtxRef.current = null;
      masterGainRef.current = null;
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 220);
    }
  }, []);

  const startSynthAmbiance = useCallback(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // Pink-noise buffer for warm rainforest rain / café steam bed
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 680;

    // Subtle warm harmonic room resonance
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 146.83; // D3 warm low hum
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.015;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.8);
    masterGainRef.current = masterGain;

    noise.connect(filter);
    filter.connect(masterGain);
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    noise.start();
    osc.start();
    setMode("synth");
  }, []);

  const stopAll = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    stopSynth();
    setIsPlaying(false);
    setMode("idle");
  }, [stopSynth]);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  async function toggleAudio() {
    if (isPlaying) {
      stopAll();
      return;
    }

    // Attempt MP3 first; fall back to procedural Web Audio synthesis if unavailable
    try {
      const check = await fetch("/media/ambient-cafe.mp3", { method: "HEAD" });
      if (check.ok) {
        if (!audioElRef.current) {
          const el = new Audio("/media/ambient-cafe.mp3");
          el.loop = true;
          el.volume = 0.35;
          audioElRef.current = el;
        }
        await audioElRef.current.play();
        setMode("mp3");
        setIsPlaying(true);
        return;
      }
    } catch {
      // Fall through to Web Audio synthesizer
    }

    startSynthAmbiance();
    setIsPlaying(true);
  }

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Mute ambient café audio" : "Play ambient café audio"}
      data-testid="ambient-audio-toggle"
      data-audio-mode={mode}
      className={`inline-flex items-center gap-2 rounded-full border border-white/25 bg-espresso-950/45 text-xs font-medium tracking-wider text-crema-100 backdrop-blur-md transition hover:border-crema-300/60 hover:bg-espresso-950/70 ${
        compact ? "px-2.5 py-1.5" : "px-3.5 py-2"
      }`}
    >
      {isPlaying ? (
        <Volume2 className="h-3.5 w-3.5 text-crema-300" />
      ) : (
        <VolumeX className="h-3.5 w-3.5 text-crema-200/75" />
      )}
      {!compact && (
        <span className="hidden sm:inline uppercase">
          {isPlaying ? "Ambiance On" : "Café Sound"}
        </span>
      )}
    </button>
  );
}
