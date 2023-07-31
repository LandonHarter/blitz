import { getUserData } from "@/backend/firebase/user";
import ProfileContent from "./profile";
import { Metadata } from "next";
import { basicMetadata } from "@/backend/util";

export async function generateMetadata({ params, seachParams }: any): Promise<Metadata> {
    const id = params.id;
    const user = await getUserData(id);

    if (!user) {
        return {
            title: 'Unknown User • Blitz',
            description: 'This user does not exist.',
        };
    }

    return basicMetadata({
        title: `${user.name} • Blitz`,
        description: `View ${user.name}'s profile.`,
        localPath: `/profile/${id}`,
    });
}

export default function ProfilePage() {
    return (<ProfileContent />);
}