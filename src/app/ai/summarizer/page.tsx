import { Metadata } from "next";
import SummarizerAIContent from "./summarizer";

export const metadata: Metadata = {
    title: "Summarizer • Blitz",
    description: "Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.",
    other: {
        "og:image": "https://blitzedu.vercel.app/icon.png",
        "og:title": "Summarizer • Blitz",
        "og:description": "Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.",
        "twitter:image": "https://blitzedu.vercel.app/icon.png",
        "twitter:title": "Summarizer • Blitz",
        "twitter:description": "Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.",
        "twitter:card": "summary_large_image",
    }
};

export default function SummarizerAIPage() {
    return (<SummarizerAIContent />);
}