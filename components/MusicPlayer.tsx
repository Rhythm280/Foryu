'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const frequencyMap: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  'F#4': 369.99,
  'C#5': 554.37,
  'A#3': 233.08
};

const chordMap = {
  major: [
    ['C4', 'E4', 'G4'],
    ['D4', 'F#4', 'A4'],
    ['G4', 'B4', 'D5'],
    ['A4', 'C#5', 'E5']
  ],
  minor: [
    ['A3', 'C4', 'E4'],
    ['D4', 'F4', 'A4'],
    ['E4', 'G4', 'B4'],
    ['F4', 'A4', 'C5']
  ]
} as const;

const moodConfig = {
  calm: {
    type: 'sine' as OscillatorType,
    volume: 0.08,
    filterFreq: 400,
    noteDuration: 3,
    fade: 1.5,
    chordInterval: 8
  },
  tender: {
    type: 'triangle' as OscillatorType,
    volume: 0.07,
    filterFreq: 600,
    noteDuration: 2.5,
    fade: 1.2,
    chordInterval: 6
  },
  melancholic: {
    type: 'sine' as OscillatorType,
    volume: 0.06,
    filterFreq: 350,
    noteDuration: 4,
    fade: 2,
    chordInterval: 10
  },
  warm: {
    type: 'triangle' as OscillatorType,
    volume: 0.09,
    filterFreq: 700,
    noteDuration: 2,
    fade: 1,
    chordInterval: 5
  },
  dreamy: {
    type: 'sine' as OscillatorType,
    volume: 0.07,
    filterFreq: 500,
    noteDuration: 3.5,
    fade: 2,
    chordInterval: 9
  }
};

const melodyPatterns: Record<'major' | 'minor', string[]> = {
  major: ['E4', 'G4', 'C5', 'B4'],
  minor: ['C4', 'D4', 'E4', 'G4']
};

function isAudioSupported() {
  if (typeof window === 'undefined') return false;
  return typeof window.AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
}

function getAudioContextClass() {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext || (window as any).webkitAudioContext;
}

function createOscillator(context: AudioContext, frequency: number, type: OscillatorType) {
  const osc = context.createOscillator();
  osc.type = type;
  osc.frequency.value = frequency;
  return osc;
}

export function MusicPlayer({
  musicMood,
  musicTempo,
  musicKey,
  accentColor
}: {
  musicMood: 'calm' | 'tender' | 'melancholic' | 'warm' | 'dreamy';
  musicTempo: 'slow' | 'medium';
  musicKey: 'major' | 'minor';
  accentColor: string;
}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const chordTimerRef = useRef<number | null>(null);
  const melodyTimerRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const currentChordIndexRef = useRef(0);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const activeMelodyRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    setIsSupported(isAudioSupported());
    return () => {
      if (chordTimerRef.current) window.clearTimeout(chordTimerRef.current);
      if (melodyTimerRef.current) window.clearTimeout(melodyTimerRef.current);
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  const config = useMemo(() => moodConfig[musicMood], [musicMood]);
  const progression = useMemo(() => chordMap[musicKey], [musicKey]);

  const stopAllVoices = () => {
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // ignore
      }
      try {
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeMelodyRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // ignore
      }
      try {
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeOscillatorsRef.current = [];
    activeMelodyRef.current = [];
  };

  const createAudioEngine = () => {
    try {
      const AudioContextClass = getAudioContextClass();
      if (!AudioContextClass) return null;
      const context = new AudioContextClass();
      const masterGain = context.createGain();
      masterGain.gain.value = 0;
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = config.filterFreq;
      masterGain.connect(filter);
      filter.connect(context.destination);

      const delay1 = context.createDelay(1);
      delay1.delayTime.value = 0.1;
      const reverbGain1 = context.createGain();
      reverbGain1.gain.value = 0.3;
      masterGain.connect(delay1);
      delay1.connect(reverbGain1);
      reverbGain1.connect(context.destination);

      const delay2 = context.createDelay(1);
      delay2.delayTime.value = 0.3;
      const reverbGain2 = context.createGain();
      reverbGain2.gain.value = 0.15;
      masterGain.connect(delay2);
      delay2.connect(reverbGain2);
      reverbGain2.connect(context.destination);

      const delay3 = context.createDelay(1);
      delay3.delayTime.value = 0.6;
      const reverbGain3 = context.createGain();
      reverbGain3.gain.value = 0.08;
      masterGain.connect(delay3);
      delay3.connect(reverbGain3);
      reverbGain3.connect(context.destination);

      audioContextRef.current = context;
      masterGainRef.current = masterGain;
      filterRef.current = filter;
      return context;
    } catch (error) {
      return null;
    }
  };

  const scheduleChord = () => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    const filter = filterRef.current;
    if (!context || !masterGain || !filter) return;

    const chord = progression[currentChordIndexRef.current];
    const now = context.currentTime;
    const targetVolume = config.volume / (musicTempo === 'slow' ? 1 : 1.05);

    chord.forEach((note) => {
      const oscillator = createOscillator(context, frequencyMap[note], config.type);
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(targetVolume / chord.length, now + config.fade);
      gain.gain.setTargetAtTime(0, now + config.noteDuration - config.fade, 0.6);
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start(now);
      oscillator.stop(now + config.noteDuration + 0.2);
      activeOscillatorsRef.current.push(oscillator);
    });

    if (currentChordIndexRef.current % 3 === 0) {
      melodyTimerRef.current = window.setTimeout(() => {
        const melody = melodyPatterns[musicKey];
        const melodyStart = context.currentTime;
        melody.forEach((note, index) => {
          const oscillator = createOscillator(context, frequencyMap[note], config.type);
          const gain = context.createGain();
          const noteTime = melodyStart + index * 0.7;
          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(targetVolume * 0.4, noteTime + 0.15);
          gain.gain.setTargetAtTime(0, noteTime + 1.2, 0.5);
          oscillator.connect(gain);
          gain.connect(filter);
          oscillator.start(noteTime);
          oscillator.stop(noteTime + 1.4);
          activeMelodyRef.current.push(oscillator);
        });
      }, 100);
    }

    currentChordIndexRef.current = (currentChordIndexRef.current + 1) % progression.length;
    chordTimerRef.current = window.setTimeout(scheduleChord, config.chordInterval * 1000);
  };

  const fadeIn = () => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(config.volume, now + 3);
  };

  const fadeOutAndStop = () => {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!context || !masterGain) return;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2);
    fadeTimeoutRef.current = window.setTimeout(() => {
      stopAllVoices();
      try {
        context.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
      masterGainRef.current = null;
      filterRef.current = null;
    }, 2200);
  };

  const handleToggle = async () => {
    if (!isSupported) return;

    try {
      let context = audioContextRef.current;
      if (!context) {
        context = createAudioEngine();
      }
      if (!context) {
        setIsSupported(false);
        return;
      }

      if (context.state === 'suspended') {
        await context.resume();
      }

      if (isPlaying) {
        fadeOutAndStop();
        setIsPlaying(false);
        return;
      }

      fadeIn();
      scheduleChord();
      setIsPlaying(true);
    } catch {
      setIsSupported(false);
      setIsPlaying(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4 sm:px-0">
      <button
        type="button"
        onClick={handleToggle}
        title={`${musicMood} · ${musicKey}`}
        className="group mx-auto flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-cream shadow-soft backdrop-blur-xl transition hover:border-blush hover:bg-white/15"
        style={{ boxShadow: `0 20px 50px ${accentColor}20` }}>
        <span className="relative flex h-6 w-6 items-center justify-center">
          {isPlaying ? (
            <span className="flex items-end gap-1">
              <span className="h-4 w-1 rounded-full bg-cream animate-eq-bar" />
              <span className="h-6 w-1 rounded-full bg-cream animate-eq-bar delay-200" />
              <span className="h-5 w-1 rounded-full bg-cream animate-eq-bar delay-100" />
            </span>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-cream opacity-90">
              <path d="M9 3v12.55a3.5 3.5 0 1 0 2 3.15V7h4V3H9Z" />
            </svg>
          )}
        </span>
        <span>{isPlaying ? 'pause music' : 'play music'}</span>
      </button>
      <style jsx>{`
        .animate-eq-bar {
          animation: eqPulse 900ms ease-in-out infinite;
          display: inline-block;
          background: currentColor;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        @keyframes eqPulse {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
