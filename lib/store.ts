import type { Gift } from '@/types/gift';

const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;
const hasKv = Boolean(kvUrl && kvToken);
const memoryStore = new Map<string, Gift>();

async function kvFetch(path: string, init: RequestInit) {
    if (!kvUrl || !kvToken) {
        throw new Error('Vercel KV is not configured');
    }

    const url = `${kvUrl.replace(/\/$/, '')}/${path}`;
    const response = await fetch(url, {
        ...init,
        headers: {
            ...(init.headers ?? {}),
            Authorization: `Bearer ${kvToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`KV request failed: ${response.statusText}`);
    }

    return response;
}

export async function saveGift(gift: Gift) {
    if (hasKv) {
        await kvFetch(encodeURIComponent(gift.id), {
            method: 'PUT',
            body: JSON.stringify(gift)
        });
        return gift;
    }

    if (typeof window !== 'undefined') {
        window.localStorage.setItem(`little-world-gift-${gift.id}`, JSON.stringify(gift));
        return gift;
    }

    memoryStore.set(gift.id, gift);
    return gift;
}

export async function getGift(id: string) {
    if (hasKv) {
        try {
            const response = await kvFetch(encodeURIComponent(id), { method: 'GET' });
            return (await response.json()) as Gift;
        } catch {
            return null;
        }
    }

    if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(`little-world-gift-${id}`);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as Gift;
        } catch {
            return null;
        }
    }

    return memoryStore.get(id) ?? null;
}
