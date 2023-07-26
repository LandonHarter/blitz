import { Metadata } from "next";
import WhyUsContent from "./whyus";

export const metadata: Metadata = {
    title: 'Why Us • Blitz',
    description: 'Why should you use Blitz?',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Why Us • Blitz',
        'og:description': 'Why should you use Blitz?',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Why Us • Blitz',
        'twitter:description': 'Why should you use Blitz?',
        'twitter:card': 'app',
    }
};

export default function WhyUsPage() {
    return (<WhyUsContent />);
}