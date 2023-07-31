import { Metadata } from "next";
import AboutContent from "./about";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'About Us • Blitz',
    description: 'Learn more about the Blitz team and our mission to make learning fun.',
    localPath: '/about',
});

export default function AboutPage() {
    return (<AboutContent />);
}