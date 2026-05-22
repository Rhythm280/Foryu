'use client';

import type { Gift } from '@/types/gift';
import { HeroSection } from './HeroSection';
import { PoemSection } from './PoemSection';
import { ArtCanvas } from './ArtCanvas';
import { MessageCard } from './MessageCard';
import { ParticleBackground } from './ParticleBackground';
import { CopyLinkButton } from './CopyLinkButton';
import { MusicPlayer } from './MusicPlayer';

export function GiftView({ gift }: { gift: Gift }) {
    return (
        <main className="relative min-h-screen overflow-hidden bg-background text-text">
            <ParticleBackground accentColor={gift.accentColor} />
            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-10 sm:px-8 lg:px-12">
                <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-surface/65 p-10 shadow-soft backdrop-blur-xl">
                    <HeroSection herName={gift.herName} accentColor={gift.accentColor} />
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-2xl text-base leading-8 text-text/80">Something made, just for you — with a quiet glow, soft motion, and a private note from {gift.myName}.</p>
                        <CopyLinkButton />
                    </div>
                </section>

                <section className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
                    <PoemSection poem={gift.poem} accentColor={gift.accentColor} />
                    <div className="space-y-10">
                        <div className="rounded-[32px] border border-white/10 bg-surface/70 p-6 shadow-soft backdrop-blur-xl">
                            <ArtCanvas seed={gift.artSeed} accentColor={gift.accentColor} />
                        </div>
                        <MessageCard message={gift.message} myName={gift.myName} accentColor={gift.accentColor} />
                    </div>
                </section>

                <section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-surface/70 p-8 text-center shadow-soft backdrop-blur-xl">
                    <p className="text-lg italic text-text/80">made with something that feels a lot like love.</p>
                </section>
            </div>
            <MusicPlayer
                musicMood={gift.musicMood}
                musicTempo={gift.musicTempo}
                musicKey={gift.musicKey}
                accentColor={gift.accentColor}
            />
        </main>
    );
}
