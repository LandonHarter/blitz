import { Metadata } from "next";
import CreateContent from "./create";

export const metadata: Metadata = {
    title: 'Create • Blitz',
    description: 'Create a new set on Blitz!',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Create • Blitz',
        'og:description': 'Create a new set on Blitz!',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Create • Blitz',
        'twitter:description': 'Create a new set on Blitz!',
        'twitter:card': 'summary_large_image',
    }
}

export default function CreatePage() {
    return (<CreateContent />);
}