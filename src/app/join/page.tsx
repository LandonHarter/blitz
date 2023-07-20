import { Metadata } from "next";
import JoinPageContent from "./join";

export const metadata: Metadata = {
    title: "Join Game - Blitz",
    description: "Join a live Blitz game!",
}

export default function JoinPage() {
    return (<JoinPageContent />);
}