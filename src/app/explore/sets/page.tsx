import { Metadata } from "next";
import ExploreContent from "./explore";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Explore Sets • Blitz',
    description: 'Explore endless sets created by the Blitz community.',
    localPath: '/explore/sets',
});

export default function ExplorePage() {
    return (<ExploreContent />);
}