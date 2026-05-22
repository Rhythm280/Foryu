'use client';

import { motion } from 'framer-motion';

export function HeroSection({ herName, accentColor }: { herName: string; accentColor: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-text/60">For her</p>
                <h1 className="mt-4 text-5xl font-semibold leading-tight text-cream sm:text-6xl">{herName}</h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-text/80">A gentle gift written for you, with soft motion, quiet light, and a tender note from the heart.</p>
                <div className="mt-6 inline-flex rounded-full px-4 py-2 text-sm font-medium" style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
                    something made, just for you
                </div>
            </div>
        </motion.div>
    );
}
