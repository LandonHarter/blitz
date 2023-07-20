import { Metadata } from "next";
import ContactContent from "./contact";

export const metadata: Metadata = {
    title: 'Contact Us • Blitz',
};

export default function ContactPage() {
    return (<ContactContent />);
}