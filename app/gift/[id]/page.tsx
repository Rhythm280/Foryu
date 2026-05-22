import { Metadata } from 'next';
import { getGift } from '@/lib/store';
import { HeroSection } from '@/components/HeroSection';
import { PoemSection } from '@/components/PoemSection';
import { ArtCanvas } from '@/components/ArtCanvas';
import { MessageCard } from '@/components/MessageCard';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { MusicPlayer } from '@/components/MusicPlayer';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const gift = await getGift(params.id);
  if (!gift) {
    return {
      title: 'Foryu',
      description: 'A private romantic gift page.'
    };
  }

  return {
    title: `Something made just for ${gift.herName} • Foryu`,
    description: gift.poem[0]?.split('\n')[0] ?? 'A handmade gift that feels like a warm letter.',
    openGraph: {
      title: `Something made just for ${gift.herName}`,
      description: gift.poem[0]?.split('\n')[0] ?? 'A handmade gift that feels like a warm letter.',
      type: 'website'
    }
  };
}

export default async function GiftPage({ params }: { params: { id: string } }) {
  const gift = await getGift(params.id);
  if (!gift) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 text-text sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-surface/80 p-10 text-center shadow-soft backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-text/60">Gift not found</p>
          <h1 className="mt-4 text-3xl font-semibold">This page feels like a secret that disappeared.</h1>
          <p className="mt-4 text-text/70">If you just created a gift, try opening the share link again or refresh the page.</p>
        </div>
      </main>
    );
  }

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
        musicMood={gift.musicMood ?? 'calm'}
        musicTempo={gift.musicTempo ?? 'slow'}
        musicKey={gift.musicKey ?? 'major'}
        accentColor={gift.accentColor}
      />
    </main>
  );
}
