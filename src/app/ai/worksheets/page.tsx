import WorksheetCreatorContent from "./worksheets";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Worksheet Creator • Blitz",
    description: "Generate a full worksheet with the help of AI. Get questions on any topic.",
};

export default function WorksheetCreatorPage() {
    return (<WorksheetCreatorContent />);
}