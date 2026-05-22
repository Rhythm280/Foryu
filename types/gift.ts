export type Gift = {
    id: string;
    herName: string;
    myName: string;
    trait: string;
    memory: string;
    vibe: 'soft & sweet' | 'deep & poetic' | 'warm & playful';
    poem: string[];
    message: string;
    artSeed: number;
    musicMood: 'calm' | 'tender' | 'melancholic' | 'warm' | 'dreamy';
    musicTempo: 'slow' | 'medium';
    musicKey: 'major' | 'minor';
    accentColor: string;
    createdAt: string;
};
