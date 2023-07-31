import { Metadata } from "next";
import CreateContent from "./create";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Create New Set • Blitz',
    description: 'Create a new Blitz set.',
    localPath: '/create',
});

export default function CreatePage() {
    return (<CreateContent />);
}