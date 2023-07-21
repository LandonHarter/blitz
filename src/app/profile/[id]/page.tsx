import { getUserData } from "@/backend/firebase/user";
import ProfileContent from "./profile";
import { Metadata } from "next";

export async function generateMetadata({ params, seachParams }: any): Promise<Metadata> {
    const id = params.id;
    const user = await getUserData(id);

    if (!user) {
        return {
            title: 'Unknown User • Blitz',
            description: 'This user does not exist.',
        };
    }

    return {
        title: `${user.name} • Blitz`,
        description: `View ${user.name}'s profile on Blitz!`,
        other: {
            'twitter:card': 'summary_large_image',
            'twitter:image': user.pfp,
            'twitter:site': '@blitzedu',
            'twitter:title': user.name,
            'twitter:description': `View ${user.name}'s profile on Blitz!`,
        }
    };
}

export default function ProfilePage() {
    return (<ProfileContent />);
}