import { Metadata } from "next";
import UsersExploreContent from "./explore";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Explore Users • Blitz',
    description: 'Explore people in the Blitz community.',
    localPath: '/explore/sets',
});

export default function ExplorePage() {
    return (<UsersExploreContent />);
}