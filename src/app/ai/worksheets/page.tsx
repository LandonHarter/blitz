import WorksheetCreatorContent from "./worksheets";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Worksheet Creator • Blitz",
    description: "Generate a full worksheet with the help of AI. Get questions on any topic.",
    other: {
        "og:image": "https://blitzedu.vercel.app/icon.png",
        "og:title": "Worksheet Creator • Blitz",
        "og:description": "Generate a full worksheet with the help of AI. Get questions on any topic.",
        "twitter:image": "https://blitzedu.vercel.app/icon.png",
        "twitter:title": "Worksheet Creator • Blitz",
        "twitter:description": "Generate a full worksheet with the help of AI. Get questions on any topic.",
        "twitter:card": "summary_large_image",
    }
};

export default function WorksheetCreatorPage() {
    return (<WorksheetCreatorContent />);
}