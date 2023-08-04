import { Metadata } from "next";
import CourseContent from "./course";
import { getCourse } from "@/backend/course/course";
import { basicMetadata } from "@/backend/util";

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
    const id = params.id;
    const courseData = await getCourse(id);

    if (!courseData) {
        return {
            title: 'Unknown Course',
            description: 'This course does not exist.',
        };
    }

    return basicMetadata({
        title: `${courseData.name} • Blitz`,
        description: courseData.description,
        localPath: `/course/${id}`,
        keywords: courseData.keywords,
    });
}

export default function CoursePage() {
    return <CourseContent />;
}