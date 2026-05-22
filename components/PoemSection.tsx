'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export function PoemSection({ poem, accentColor }: { poem: string[]; accentColor: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: '-120px' });
    const [revealed, setRevealed] = useState(0);

    useEffect(() => {
        if (isInView && revealed < poem.length) {
            const timeout = window.setTimeout(() => setRevealed((value) => Math.min(poem.length, value + 1)), 400);
            return () => window.clearTimeout(timeout);
        }
    }, [isInView, revealed, poem.length]);

    return (
        <div ref={ref} className="space-y-8 rounded-[40px] border border-white/10 bg-surface/70 p-8 shadow-soft backdrop-blur-xl">
            <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.35em] text-text/60">Poem</p>
                <h2 className="text-3xl font-semibold text-cream">A reflection in stanzas</h2>
            </div>
            <div className="space-y-8">
                {poem.map((stanza, index) => (
                    <motion.div
                        key={`stanza-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: revealed > index ? 1 : 0.2, y: revealed > index ? 0 : 20 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className="rounded-3xl border border-white/10 bg-background/50 p-6 text-text/90 shadow-[0_16px_50px_rgba(15,15,20,0.25)]">
                        <pre className="whitespace-pre-wrap break-words text-base leading-8">{stanza}</pre>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
