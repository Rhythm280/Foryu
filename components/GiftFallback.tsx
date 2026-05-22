'use client';

import { useEffect, useState } from 'react';
import type { Gift } from '@/types/gift';
import { GiftView } from './GiftView';

export function GiftFallback({ id }: { id: string }) {
    const [gift, setGift] = useState<Gift | null | 'loading'>('loading');

    useEffect(() => {
        const localKey = `little-world-gift-${id}`;
        if (typeof window !== 'undefined') {
            const raw = window.localStorage.getItem(localKey);
            if (raw) {
                try {
                    setGift(JSON.parse(raw));
                    return;
                } catch {
                    // fall through to fetch
                }
            }
        }

        const fetchGift = async () => {
            try {
                const response = await fetch(`/api/gift?id=${encodeURIComponent(id)}`);
                if (!response.ok) {
                    setGift(null);
                    return;
                }

                const data = (await response.json()) as Gift;
                window.localStorage.setItem(localKey, JSON.stringify(data));
                setGift(data);
            } catch {
                setGift(null);
            }
        };

        void fetchGift();
    }, [id]);

    if (gift === 'loading') {
        return (
            <main className="min-h-screen bg-background px-6 py-10 text-text sm:px-8 lg:px-12">
                <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-surface/80 p-10 text-center shadow-soft backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-text/60">Looking for your gift</p>
                    <h1 className="mt-4 text-3xl font-semibold">Hold tight while we reconnect your page.</h1>
                    <p className="mt-4 text-text/70">If the gift was just created, this will restore it from the same browser session.</p>
                </div>
            </main>
        );
    }

    if (!gift) {
        return (
            <main className="min-h-screen bg-background px-6 py-10 text-text sm:px-8 lg:px-12">
                <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-surface/80 p-10 text-center shadow-soft backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-text/60">Gift not found</p>
                    <h1 className="mt-4 text-3xl font-semibold">This page feels like a secret that disappeared.</h1>
                    <p className="mt-4 text-text/70">If you just created a gift, the server may not have persistent storage enabled. Configure Vercel KV or refresh the page from the same browser.</p>
                </div>
            </main>
        );
    }

    return <GiftView gift={gift} />;
}
