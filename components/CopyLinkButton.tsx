'use client';

import { useState } from 'react';

export function CopyLinkButton() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (typeof window === 'undefined') return;
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-text transition hover:border-blush hover:text-cream">
            {copied ? 'Link copied' : 'Copy link'}
        </button>
    );
}
