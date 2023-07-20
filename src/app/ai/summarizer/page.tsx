import { Metadata } from "next";
import SummarizerAIContent from "./summarizer";

export const metadata: Metadata = {
    title: "Summarizer • Blitz",
    description: "Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.",
};

export default function SummarizerAIPage() {
    return (<SummarizerAIContent />);
}