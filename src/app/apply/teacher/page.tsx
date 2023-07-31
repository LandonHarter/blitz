import { Metadata } from "next";
import ApplyTeacherContent from "./application";
import { basicMetadata } from "@/backend/util";

export const metadata: Metadata = basicMetadata({
    title: 'Teacher Application • Blitz',
    description: 'Apply to become a teacher on Blitz and help students learn.',
    localPath: '/apply/teacher',
});

export default function TeacherApplyPage() {
    return (<ApplyTeacherContent />);
}