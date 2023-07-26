import { Metadata } from "next";
import ContactContent from "./contact";

export const metadata: Metadata = {
    title: 'Contact Us • Blitz',
    description: 'Contact the Blitz team for any questions, concerns, or feedback.',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Contact Us • Blitz',
        'og:description': 'Contact the Blitz team for any questions, concerns, or feedback.',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Contact Us • Blitz',
        'twitter:description': 'Contact the Blitz team for any questions, concerns, or feedback.',
        'twitter:card': 'app',
    }
};

export default function ContactPage() {
    return (<ContactContent />);
}