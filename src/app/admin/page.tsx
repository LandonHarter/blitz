import { Metadata } from "next";
import AdminContent from "./admin";

export const metadata: Metadata = {
    title: 'Admin Dashboard • Blitz',
    robots: 'noindex, nofollow, noarchive',
};

export default function AdminPage() {
    return (<AdminContent />);
}