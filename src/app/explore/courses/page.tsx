import { Metadata } from "next";
import CoursesContent from "./courses";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: "Explore Courses • Blitz",
    description: "Explore endless courses created by the Blitz community.",
    localPath: "/explore/courses",
})

export default function CoursesPage() {
    return <CoursesContent />;
}