export type ClaudeInput = {
    herName: string;
    myName: string;
    trait: string;
    memory: string;
    vibe: 'soft & sweet' | 'deep & poetic' | 'warm & playful';
};

export type ClaudeResult = {
    poem: string[];
    message: string;
    artSeed: number;
    musicMood: 'calm' | 'tender' | 'melancholic' | 'warm' | 'dreamy';
    musicTempo: 'slow' | 'medium';
    musicKey: 'major' | 'minor';
};

const promptTemplate = ({ herName, myName, trait, memory, vibe }: ClaudeInput) => `You are a romantic poet and thoughtful writer. Based on the details given, generate a JSON response with:
- poem: array of 3 stanzas (4 lines each), warm and personal, referencing the specific trait and memory provided. NOT generic. Feel like it was written just for her.
- message: a short heartfelt paragraph (4-5 sentences) from the sender, personal and warm, not cheesy or over the top.
- artSeed: a number 1-5 that represents the emotional tone (1=calm, 5=vibrant)
- musicMood: one of calm, tender, melancholic, warm, dreamy
- musicTempo: slow or medium
- musicKey: major or minor

Also analyze the emotional tone of the poem you will write and return:
- musicMood: the closest match from [calm, tender, melancholic, warm, dreamy]
- musicTempo: slow if the poem is reflective, medium if it feels alive
- musicKey: major if the overall feeling is hopeful/warm, minor if wistful/longing
These must match the actual poem you generate — not generic defaults.
Return ONLY valid JSON, no markdown.

Her name: ${herName}
My name: ${myName}
What I love about her: ${trait}
Our memory/inside thing: ${memory}
Vibe: ${vibe}`;

const parseClaudeOutput = (text: string): ClaudeResult => {
    try {
        const payload = JSON.parse(text.trim());
        if (
            !Array.isArray(payload.poem) ||
            typeof payload.message !== 'string' ||
            typeof payload.artSeed !== 'number' ||
            typeof payload.musicMood !== 'string' ||
            typeof payload.musicTempo !== 'string' ||
            typeof payload.musicKey !== 'string'
        ) {
            throw new Error('Invalid response structure');
        }

        return {
            poem: payload.poem.map((line: unknown) => String(line)),
            message: String(payload.message).trim(),
            artSeed: Number(payload.artSeed),
            musicMood: String(payload.musicMood) as ClaudeResult['musicMood'],
            musicTempo: String(payload.musicTempo) as ClaudeResult['musicTempo'],
            musicKey: String(payload.musicKey) as ClaudeResult['musicKey']
        };
    } catch (error) {
        throw new Error('Unable to parse Claude response.');
    }
};

const claudeKey = process.env.ANTHROPIC_API_KEY;

export async function generateClaudeGift(input: ClaudeInput): Promise<ClaudeResult> {
    if (!claudeKey) {
        throw new Error('Missing Anthropic API key');
    }

    const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': claudeKey
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            prompt: promptTemplate(input),
            max_tokens_to_sample: 700,
            temperature: 0.7,
            top_p: 1,
            stop_sequences: ['\n\nHuman:']
        })
    });

    if (!response.ok) {
        throw new Error('Claude request failed');
    }

    const data = await response.json();
    const text = typeof data?.completion === 'string' ? data.completion : data?.completion?.[0]?.content?.[0]?.text ?? JSON.stringify(data);
    return parseClaudeOutput(text);
}
