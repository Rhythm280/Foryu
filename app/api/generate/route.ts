import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateClaudeGift } from '@/lib/claude';
import { saveGift } from '@/lib/store';
import type { Gift } from '@/types/gift';

const requestSchema = z.object({
    herName: z.string().min(1),
    myName: z.string().min(1),
    trait: z.string().min(1),
    memory: z.string().min(1),
    vibe: z.enum(['soft & sweet', 'deep & poetic', 'warm & playful']),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/)
});

const rateMap = new Map<string, { count: number; expires: number }>();

function getClientIp(request: Request) {
    const header = request.headers.get('x-forwarded-for') ?? request.headers.get('true-client-ip') ?? 'unknown';
    return header.split(',')[0].trim();
}

function checkRateLimit(ip: string) {
    const now = Date.now();
    const existing = rateMap.get(ip);
    if (!existing || existing.expires < now) {
        rateMap.set(ip, { count: 1, expires: now + 60 * 60 * 1000 });
        return false;
    }

    if (existing.count >= 10) {
        return true;
    }

    existing.count += 1;
    return false;
}

function fallbackGift(): {
    poem: string[];
    message: string;
    artSeed: number;
    musicMood: 'calm' | 'tender' | 'melancholic' | 'warm' | 'dreamy';
    musicTempo: 'slow' | 'medium';
    musicKey: 'major' | 'minor';
} {
    return {
        poem: [
            `A quiet dawn wrapped in your glow,
A gentle song the moments know.
I keep your laughter, close and true,
This little world is made for you.`,
            `Soft whispers held inside the day,
A shared glance that lightens gray.
Your courage sings in every view,
The story feels like only you.`,
            `In every hush and golden thread,
I trace the warmth of words unsaid.
A promise folded like a tune,
A heart made ready for you soon.`
        ],
        message: 'Even when the world feels wide, my thoughts keep returning to the quiet conversation we shared and the easy comfort between us. I wanted to give you something gentle, true, and quietly beautiful, just like the way you make every ordinary moment feel special.',
        artSeed: 2,
        musicMood: 'calm',
        musicTempo: 'slow',
        musicKey: 'major'
    };
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    if (checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { herName, myName, trait, memory, vibe, accentColor } = parsed.data;

    try {
        const giftContent = await generateClaudeGift({ herName, myName, trait, memory, vibe });
        const id = crypto.randomUUID().slice(0, 8);
        const gift: Gift = {
            id,
            herName,
            myName,
            trait,
            memory,
            vibe,
            poem: giftContent.poem,
            message: giftContent.message,
            artSeed: giftContent.artSeed,
            musicMood: giftContent.musicMood,
            musicTempo: giftContent.musicTempo,
            musicKey: giftContent.musicKey,
            accentColor,
            createdAt: new Date().toISOString()
        };

        await saveGift(gift);
        return NextResponse.json({ id, gift });
    } catch (error) {
        const fallback = fallbackGift();
        const id = crypto.randomUUID().slice(0, 8);
        const gift: Gift = {
            id,
            herName,
            myName,
            trait,
            memory,
            vibe,
            poem: fallback.poem,
            message: fallback.message,
            artSeed: fallback.artSeed,
            musicMood: fallback.musicMood,
            musicTempo: fallback.musicTempo,
            musicKey: fallback.musicKey,
            accentColor,
            createdAt: new Date().toISOString()
        };
        await saveGift(gift);
        return NextResponse.json({ id, gift });
    }
}
