import { Metadata } from "next";
import JoinPageContent from "./join";

export const metadata: Metadata = {
    title: "Join Game • Blitz",
    description: "Join a live Blitz game!",
    other: {
        "og:image": "https://blitzedu.vercel.app/icon.png",
        "og:title": "Join Game • Blitz",
        "og:description": "Join a live Blitz game!",
        "twitter:image": "https://blitzedu.vercel.app/icon.png",
        "twitter:title": "Join Game • Blitz",
        "twitter:description": "Join a live Blitz game!",
        "twitter:card": "summary_large_image",
    }
}

export default function JoinPage() {
    return (<JoinPageContent />);
}