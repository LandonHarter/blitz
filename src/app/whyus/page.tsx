import { Metadata } from "next";
import WhyUsContent from "./whyus";

export const metadata: Metadata = {
    title: 'Why Us • Blitz',
    description: 'Why should you use Blitz?',
};

export default function WhyUsPage() {
    return (<WhyUsContent />);
}