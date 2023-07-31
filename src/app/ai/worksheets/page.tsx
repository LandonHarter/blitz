import { basicMetadata } from "@/backend/util";
import WorksheetCreatorContent from "./worksheets";
import { Metadata } from "next";

export const metadata: Metadata = basicMetadata({
    title: 'Worksheet Creator • Blitz',
    description: 'Generate a full worksheet with multiple open ended questions. All questions are free response and generated using AI.',
    localPath: '/ai/worksheets',
});

export default function WorksheetCreatorPage() {
    return (<WorksheetCreatorContent />);
}