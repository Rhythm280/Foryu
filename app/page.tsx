'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const vibeOptions = [
    { label: 'soft & sweet', description: 'gentle warmth with tender imagery' },
    { label: 'deep & poetic', description: 'rich emotion and layered feeling' },
    { label: 'warm & playful', description: 'bright affection with soft charm' }
];

const accentColors = [
    { value: '#f4a7b9', label: 'Blush' },
    { value: '#c5b3ff', label: 'Lavender' },
    { value: '#a8e8d2', label: 'Mint' },
    { value: '#ffe2a8', label: 'Peach' },
    { value: '#a5c7ff', label: 'Sky' }
];

export default function HomePage() {
    const router = useRouter();
    const [herName, setHerName] = useState('');
    const [myName, setMyName] = useState('');
    const [trait, setTrait] = useState('');
    const [memory, setMemory] = useState('');
    const [vibe, setVibe] = useState(vibeOptions[0].label);
    const [accentColor, setAccentColor] = useState(accentColors[0].value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ herName, myName, trait, memory, vibe, accentColor })
            });

            if (!response.ok) {
                throw new Error('Something went wrong while creating your gift.');
            }

            const data = await response.json();
            router.push(`/gift/${data.id}`);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false);
        }
    };

    return (
        <main className="relative isolate min-h-screen overflow-hidden px-6 py-10 sm:px-8 lg:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,167,185,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(167,225,255,0.12),_transparent_28%)]" />
            <div className="relative mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-surface/70 p-8 shadow-soft backdrop-blur-xl sm:p-12">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <p className="text-sm uppercase tracking-[0.35em] text-pink-200/80">A little world for you</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-cream sm:text-5xl">Create a private gift page she’ll feel in her heart.</h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-text/80">Fill in the details, choose a soft pastel accent, and let Claude write a poem and message that feels personal and intimate.</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2 text-sm text-text/80">
                            <span>Her name</span>
                            <input
                                value={herName}
                                onChange={(event) => setHerName(event.target.value)}
                                required
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/30"
                                placeholder="e.g. Sofia"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-text/80">
                            <span>His name</span>
                            <input
                                value={myName}
                                onChange={(event) => setMyName(event.target.value)}
                                required
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/30"
                                placeholder="e.g. Miguel"
                            />
                        </label>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <label className="space-y-2 text-sm text-text/80">
                            <span>One thing he loves about her</span>
                            <input
                                value={trait}
                                onChange={(event) => setTrait(event.target.value)}
                                required
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/30"
                                placeholder="e.g. her quiet courage"
                            />
                        </label>
                        <label className="space-y-2 text-sm text-text/80">
                            <span>Shared memory or inside thing</span>
                            <input
                                value={memory}
                                onChange={(event) => setMemory(event.target.value)}
                                required
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/30"
                                placeholder="e.g. our first rainy walk"
                            />
                        </label>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text/80">Mood / vibe</p>
                            <div className="grid gap-3">
                                {vibeOptions.map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => setVibe(option.label)}
                                        className={`rounded-3xl border px-4 py-3 text-left transition ${vibe === option.label ? 'border-blush bg-blush/10 text-cream' : 'border-white/10 bg-white/5 text-text/80 hover:border-blush hover:text-cream'}`}>
                                        <span className="block font-semibold">{option.label}</span>
                                        <span className="block text-xs text-text/70">{option.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text/80">Accent color</p>
                            <div className="flex flex-wrap gap-3">
                                {accentColors.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setAccentColor(option.value)}
                                        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition ${accentColor === option.value ? 'border-white' : 'border-white/10'}`}
                                        style={{ backgroundColor: option.value }}>
                                        <span className="sr-only">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error ? <p className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-text/70">Ready to share a private gift link once your poem is crafted.</div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-full bg-blush px-7 py-3 text-sm font-semibold text-background transition hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-70">
                            {loading ? 'Crafting something special...' : 'Create the gift'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
