import { Metadata } from "next";
import CreateContent from "./create";

export const metadata: Metadata = {
    title: 'Create • Blitz',
    description: 'Create a new set on Blitz!',
}

export default function CreatePage() {
    return (<CreateContent />);
}