import { Metadata } from "next";
import ContactContent from "./contact";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Contact Us • Blitz',
    description: 'You need help? We got you covered.',
    localPath: '/contact',
});

export default function ContactPage() {
    return (<ContactContent />);
}