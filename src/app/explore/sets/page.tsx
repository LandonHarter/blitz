import { Metadata } from "next";
import ExploreContent from "./explore";

export const metadata: Metadata = {
    title: 'Explore • Blitz',
    description: 'Discover new and exciting sets on Blitz!',
};

export default function ExplorePage() {
    return (<ExploreContent />);
}