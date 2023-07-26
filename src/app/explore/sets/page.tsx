import { Metadata } from "next";
import ExploreContent from "./explore";

export const metadata: Metadata = {
    title: 'Explore • Blitz',
    description: 'Discover new and exciting sets on Blitz!',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Explore • Blitz',
        'og:description': 'Discover new and exciting sets on Blitz!',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Explore • Blitz',
        'twitter:description': 'Discover new and exciting sets on Blitz!',
        'twitter:card': 'app',
    }
};

export default function ExplorePage() {
    return (<ExploreContent />);
}