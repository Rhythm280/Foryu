import { Metadata } from 'next';
import { getGift } from '@/lib/store';
import { GiftFallback } from '@/components/GiftFallback';
import { GiftView } from '@/components/GiftView';

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
        return <GiftFallback id={params.id} />;
    }

    return <GiftView gift={gift} />;
}
