import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
    title: 'Foryu',
    description: 'A romantic AI gift page with a personalized poem and message.',
    metadataBase: new URL('https://example.com'),
    openGraph: {
        title: 'Foryu',
        description: 'Create a heartfelt shareable gift with custom poetry and art.',
        type: 'website'
    }
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-text antialiased">{children}</body>
        </html>
    );
}
