import { Metadata } from "next";
import SummarizerAIContent from "./summarizer";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Text Summarizer • Blitz',
    description: 'View a shortened summary of any text, article, or document. Powered by AI.',
    localPath: '/ai/summarizer',
})

export default function SummarizerAIPage() {
    return (<SummarizerAIContent />);
}