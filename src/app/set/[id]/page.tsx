import { Metadata } from "next";
import SetContent from "./set";
import { getSet } from "@/backend/set";

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
        description: setData.description,
        other: {
            'twitter:card': 'summary_large_image',
            'twitter:image': setData.image,
            'twitter:site': '@blitzedu',
            'twitter:title': setData.name,
            'twitter:description': setData.description,
        }
    };
}

export default function SetPage() {
    return (<SetContent />);
}