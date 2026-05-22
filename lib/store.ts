import type { Gift } from '@/types/gift';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(supabaseUrl && supabaseKey);
const memoryStore = new Map<string, Gift>();

type SupabaseGift = {
    id: string;
    her_name: string;
    my_name: string;
    trait: string;
    memory: string;
    vibe: string;
    poem: string[];
    message: string;
    art_seed: number;
    music_mood: string;
    music_tempo: string;
    music_key: string;
    accent_color: string;
    created_at: string;
};

function mapGiftToSupabase(gift: Gift): SupabaseGift {
    return {
        id: gift.id,
        her_name: gift.herName,
        my_name: gift.myName,
        trait: gift.trait,
        memory: gift.memory,
        vibe: gift.vibe,
        poem: gift.poem,
        message: gift.message,
        art_seed: gift.artSeed,
        music_mood: gift.musicMood,
        music_tempo: gift.musicTempo,
        music_key: gift.musicKey,
        accent_color: gift.accentColor,
        created_at: gift.createdAt
    };
}

function mapGiftFromSupabase(row: SupabaseGift): Gift {
    return {
        id: row.id,
        herName: row.her_name,
        myName: row.my_name,
        trait: row.trait,
        memory: row.memory,
        vibe: row.vibe as Gift['vibe'],
        poem: row.poem,
        message: row.message,
        artSeed: row.art_seed,
        musicMood: row.music_mood as Gift['musicMood'],
        musicTempo: row.music_tempo as Gift['musicTempo'],
        musicKey: row.music_key as Gift['musicKey'],
        accentColor: row.accent_color,
        createdAt: row.created_at
    };
}

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
        throw new Error(`Supabase request failed: ${response.status} ${response.statusText} - ${await response.text()}`);
    }

    return response;
}

export async function saveGift(gift: Gift) {
    if (hasSupabase) {
        try {
            await supabaseFetch('/rest/v1/gifts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation'
                },
                body: JSON.stringify(mapGiftToSupabase(gift))
            });
            return gift;
        } catch (error) {
            console.error('Supabase save failed, falling back to local memory store:', error);
        }
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
            const data = (await response.json()) as SupabaseGift[];
            return data.length > 0 ? mapGiftFromSupabase(data[0]) : null;
        } catch (error) {
            console.error('Supabase get failed, falling back to local memory store:', error);
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
