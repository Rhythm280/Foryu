'use client';

import { useEffect, useMemo, useState } from 'react';

function randomBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export function ParticleBackground({ accentColor }: { accentColor: string }) {
    const particles = useMemo(
        () =>
            Array.from({ length: 40 }, () => ({
                x: randomBetween(0, 100),
                y: randomBetween(0, 100),
                size: randomBetween(0.8, 2.8),
                delay: randomBetween(0, 8)
            })),
        []
    );

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {particles.map((particle, index) => (
                <div
                    key={index}
                    className="absolute rounded-full opacity-30 blur-sm"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size * 12}px`,
                        height: `${particle.size * 12}px`,
                        backgroundColor: accentColor,
                        animation: `floaty 12s ease-in-out ${particle.delay}s infinite alternate`
                    }}
                />
            ))}
            <style jsx global>{`
        @keyframes floaty {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
      `}</style>
        </div>
    );
}
