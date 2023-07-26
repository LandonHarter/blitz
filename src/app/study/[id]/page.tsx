import { getSet } from "@/backend/set";
import StudyContent from "./study";
import { Metadata } from "next";

export async function generateMetadata({ params, seachParams }: any): Promise<Metadata> {
    const id = params.id;
    const set = await getSet(id);

    if (!set) {
        return {
            title: 'Unknown Set',
            description: 'This set does not exist.',
        };
    }

    return {
        title: `Study ${set.name} • Blitz`,
        description: set.description
    };
}

export default function StudyPage() {
    return (<StudyContent />);
}