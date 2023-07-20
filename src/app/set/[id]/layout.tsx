import { Metadata } from 'next';
import '@/globals.css';
import RootLayoutContent from '@/rootlayoutcontent';

export const metadata: Metadata = {
    title: 'Blitz',
    description: 'Use new tools and games to make studying fun.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@blitzedu" />
                <meta name="twitter:title" content="Set • Blitz" />
                <meta name="twitter:description" content="A set of questions to study." />
                <meta name="twitter:image" content="https://www.rd.com/wp-content/uploads/2016/01/04-dog-breeds-dalmation.jpg" />
            </head>
            <body>
                <RootLayoutContent>
                    {children}
                </RootLayoutContent>
            </body>
        </html>
    );
}