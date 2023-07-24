import { Metadata } from "next";
import ApplyTeacherContent from "./application";

export const metadata: Metadata = {
    title: 'Teacher Application • Blitz',
    description: 'Apply to become a verified teacher on Blitz and gain new benefits!',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Teacher Application • Blitz',
        'og:description': 'Apply to become a verified teacher on Blitz and gain new benefits!',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Teacher Application • Blitz',
        'twitter:description': 'Apply to become a verified teacher on Blitz and gain new benefits!',
        'twitter:card': 'summary_large_image',
    }
};

export default function TeacherApplyPage() {
    return (<ApplyTeacherContent />);
}