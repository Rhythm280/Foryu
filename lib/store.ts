import type { Gift } from '@/types/gift';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(supabaseUrl && supabaseKey);
const memoryStore = new Map<string, Gift>();

async function supabaseFetch(path: string, init: RequestInit) {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase is not configured');
    }

    const url = `${supabaseUrl.replace(/\/$/, '')}${path}`;
    const response = await fetch(url, {
        ...init,
        headers: {
            ...(init.headers ?? {}),
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
        }
    });

    if (!response.ok) {
        throw new Error(`Supabase request failed: ${response.statusText}`);
    }

    return response;
}

export async function saveGift(gift: Gift) {
    if (hasSupabase) {
        await supabaseFetch('/rest/v1/gifts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
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
    if (hasSupabase) {
        try {
            const response = await supabaseFetch(
                `/rest/v1/gifts?id=eq.${encodeURIComponent(id)}&select=*`,
                { method: 'GET' }
            );
            const data = (await response.json()) as Gift[];
            return data.length > 0 ? data[0] : null;
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
