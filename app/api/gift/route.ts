import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getGift, saveGift } from '@/lib/store';
import type { Gift } from '@/types/gift';

const giftSchema = z.object({
  id: z.string().min(1),
  herName: z.string().min(1),
  myName: z.string().min(1),
  trait: z.string().min(1),
  memory: z.string().min(1),
  vibe: z.enum(['soft & sweet', 'deep & poetic', 'warm & playful']),
  poem: z.array(z.string()).length(3),
  message: z.string().min(1),
  artSeed: z.number().int().min(1).max(5),
  musicMood: z.enum(['calm', 'tender', 'melancholic', 'warm', 'dreamy']),
  musicTempo: z.enum(['slow', 'medium']),
  musicKey: z.enum(['major', 'minor']),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  createdAt: z.string().min(1)
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing gift id.' }, { status: 400 });
  }

  const gift = await getGift(id);
  if (!gift) {
    return NextResponse.json({ error: 'Gift not found.' }, { status: 404 });
  }

  return NextResponse.json(gift);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = giftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid gift payload.' }, { status: 400 });
  }

  const gift = parsed.data as Gift;
  await saveGift(gift);
  return NextResponse.json(gift);
}
