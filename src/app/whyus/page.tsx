import { Metadata } from "next";
import WhyUsContent from "./whyus";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Why Us • Blitz',
    description: 'Why should you use Blitz?',
    localPath: '/whyus',
});

export default function WhyUsPage() {
    return (<WhyUsContent />);
}