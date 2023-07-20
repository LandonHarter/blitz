import { getSet } from "@/backend/live/set";
import EditContent from "./edit";
import { Metadata } from "next";

export async function generateMetadata({ params, seachParams }: any): Promise<Metadata> {
    const id = params.id;
    const setData = await getSet(id);

    if (!setData) {
        return {
            title: 'Unknown Set',
            description: 'This set does not exist.',
        };
    }

    return {
        title: `${setData.name} • Blitz`,
        description: setData.description
    };
}

export default function EditPage() {
    return (<EditContent />);
}