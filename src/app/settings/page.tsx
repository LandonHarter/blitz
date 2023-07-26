import { Metadata } from "next";
import SettingsContent from "./settings";

export const metadata: Metadata = {
    title: 'Settings • Blitz',
    description: 'Change your settings to your preference on Blitz.',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Settings • Blitz',
        'og:description': 'Change your settings to your preference on Blitz.',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Settings • Blitz',
        'twitter:description': 'Change your settings to your preference on Blitz.',
        'twitter:card': 'app',
    }
};

export default function SettingsPage() {
    return (<SettingsContent />);
}