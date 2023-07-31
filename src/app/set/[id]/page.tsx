import { Metadata } from "next";
import SetContent from "./set";
import { getSet } from "@/backend/set";
import { basicMetadata } from "@/backend/util";

export async function generateMetadata({ params, seachParams }: any): Promise<Metadata> {
    const id = params.id;
    const setData = await getSet(id);

    if (!setData) {
        return {
            title: 'Unknown Set',
            description: 'This set does not exist.',
        };
    }

    return basicMetadata({
        title: `${setData.name} • Blitz`,
        description: setData.description,
        localPath: `/set/${id}`,
    })
}

export default function SetPage() {
    return (<SetContent />);
}