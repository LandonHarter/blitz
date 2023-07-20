import { Metadata } from "next";
import AboutContent from "./about";

export const metadata: Metadata = {
    title: "About Us • Blitz",
    description: "Blitz is a collection of free tools to boost study productivity, in and out of the classroom.",
};

export default function AboutPage() {
    return (<AboutContent />);
}