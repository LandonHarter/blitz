import { Metadata } from "next";
import ApplyTeacherContent from "./application";

export const metadata: Metadata = {
    title: 'Teacher Application • Blitz',
    description: 'Apply to become a verified teacher on Blitz and gain new benefits!',
};

export default function TeacherApplyPage() {
    return (<ApplyTeacherContent />);
}