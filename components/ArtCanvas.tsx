'use client';

import { useEffect, useMemo, useRef } from 'react';

const colorPalettes = [
    ['#c5d8ff', '#f8d4e0', '#f7eedf'],
    ['#b6d7a8', '#f7d6a0', '#f9e7d6'],
    ['#f4a7b9', '#d3c8f7', '#fce8d9'],
    ['#d4e8ff', '#c4d9ff', '#f9f1ef'],
    ['#e7d4ff', '#ffdbd3', '#d9f0ea']
];

export function ArtCanvas({ seed, accentColor }: { seed: number; accentColor: string }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const palette = useMemo(() => colorPalettes[(seed - 1) % colorPalettes.length], [seed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpr;
            canvas.height = canvas.clientHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener('resize', resize);

        const circles = Array.from({ length: 12 }, () => ({
            x: Math.random() * 1,
            y: Math.random() * 1,
            radius: 0.08 + Math.random() * 0.1,
            speed: 0.0006 + Math.random() * 0.0012,
            angle: Math.random() * Math.PI * 2,
            color: palette[Math.floor(Math.random() * palette.length)]
        }));

        let frame = 0;
        const render = () => {
            if (!canvas || !ctx) return;
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#0f0f14';
            ctx.fillRect(0, 0, width, height);

            if (seed <= 2) {
                circles.forEach((circle, index) => {
                    const drift = Math.sin(frame * circle.speed + index) * 0.06;
                    const px = circle.x * width + Math.cos(frame * circle.speed + index) * 15;
                    const py = circle.y * height + drift * height;
                    const grad = ctx.createRadialGradient(px, py, 0, px, py, circle.radius * width);
                    grad.addColorStop(0, circle.color + 'dd');
                    grad.addColorStop(1, 'transparent');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(px, py, circle.radius * width, 0, Math.PI * 2);
                    ctx.fill();
                });
            } else if (seed === 3) {
                const centerX = width / 2;
                const centerY = height / 2;
                const ringCount = 6;
                for (let ring = 0; ring < ringCount; ring += 1) {
                    const radius = (Math.min(width, height) / 2.6) * ((ring + 1) / ringCount);
                    const count = 8 + ring * 2;
                    for (let i = 0; i < count; i += 1) {
                        const angle = (i / count) * Math.PI * 2 + frame * 0.0008 * (ring + 1);
                        const px = centerX + Math.cos(angle) * radius;
                        const py = centerY + Math.sin(angle) * radius;
                        ctx.fillStyle = palette[i % palette.length] + 'cc';
                        ctx.beginPath();
                        ctx.arc(px, py, 12 - ring, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            } else {
                const starCount = 80;
                for (let i = 0; i < starCount; i += 1) {
                    const x = (Math.sin(frame * 0.0005 + i) * 0.5 + 0.5) * width;
                    const y = ((i / starCount) * height + Math.cos(frame * 0.0007 + i) * 24) % height;
                    ctx.fillStyle = i % 3 === 0 ? accentColor : palette[i % palette.length];
                    ctx.globalAlpha = 0.7;
                    ctx.beginPath();
                    ctx.arc(x, y, 1.3 + Math.sin(frame * 0.001 + i) * 0.9, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            }

            frame += 1;
            requestAnimationFrame(render);
        };

        const handle = requestAnimationFrame(render);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(handle);
        };
    }, [accentColor, palette, seed]);

    return (
        <div className="relative h-72 overflow-hidden rounded-[32px] bg-background/80 p-3">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/5 via-transparent to-white/0" />
            <canvas ref={canvasRef} className="h-full w-full rounded-[28px]" />
        </div>
    );
}
