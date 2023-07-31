import { Metadata } from "next";
import JoinPageContent from "./join";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Join Game • Blitz',
    description: 'Join and play a live hosted game!',
    localPath: '/join',
})

export default function JoinPage() {
    return (<JoinPageContent />);
}