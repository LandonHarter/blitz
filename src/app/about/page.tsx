import { Metadata } from "next";
import AboutContent from "./about";

export const metadata: Metadata = {
    title: "About Us • Blitz",
    description: "Blitz is a collection of free tools to boost study productivity, in and out of the classroom.",
    other: {
        "og:image": "https://blitzedu.vercel.app/icon.png",
        "og:title": "About Us • Blitz",
        "og:description": "Blitz is a collection of free tools to boost study productivity, in and out of the classroom.",
        "twitter:image": "https://blitzedu.vercel.app/icon.png",
        "twitter:title": "About Us • Blitz",
        "twitter:description": "Blitz is a collection of free tools to boost study productivity, in and out of the classroom.",
        "twitter:card": "summary_large_image",
    }
};

export default function AboutPage() {
    return (<AboutContent />);
}