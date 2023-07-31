import { Metadata } from "next";
import MySetsContent from "./mysets";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'My Sets • Blitz',
    description: 'View your own sets!',
    localPath: '/my-sets',
});

export default function MySetsPage() {
    return (<MySetsContent />);
}