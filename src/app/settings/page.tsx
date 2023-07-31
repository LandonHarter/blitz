import { Metadata } from "next";
import SettingsContent from "./settings";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Settings • Blitz',
    description: 'Change your Blitz settings.',
    localPath: '/settings',
})

export default function SettingsPage() {
    return (<SettingsContent />);
}