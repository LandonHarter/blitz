import { Metadata } from "next";
import SettingsContent from "./settings";

export const metadata: Metadata = {
    title: 'Settings • Blitz',
    description: 'Change your settings to your preference on Blitz.',
};

export default function SettingsPage() {
    return (<SettingsContent />);
}