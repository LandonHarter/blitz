import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/init";

export interface Course {

    id: string;
    name: string;
    description: string;
    author: string;
    image: string;
    keywords: string[];
    lastUpdated: Date;
    chapters: CourseChapter[];
    published?: boolean;

}

export interface CourseChapter {

    id: string;
    name: string;
    lessons: CourseLesson[];

}

export interface CourseLesson {

    id: string;
    name: string;
    video: string;
    content: string;
    set?: string;

}

const courseCache: { [id: string]: Course } = {};
export const getCourse = async (id: string) => {
    if (courseCache[id]) {
        return courseCache[id];
    }

    const courseRef = doc(collection(firestore, 'courses'), id);
    const courseDoc = await getDoc(courseRef);

    if (!courseDoc.exists()) {
        return null;
    }

    const courseData = courseDoc.data();
    const chaptersRef = collection(courseRef, 'chapters');
    const chaptersSnapshot = await getDocs(chaptersRef);
    const chaptersData = chaptersSnapshot.docs.map(doc => doc.data());

    const chapters: CourseChapter[] = [];
    for (let i = 0; i < chaptersData.length; i++) {
        const lessonsRef = collection(chaptersRef, `${i + 1}/lessons`);
        const lessonsSnapshot = await getDocs(lessonsRef);
        const lessonsData = lessonsSnapshot.docs.map(doc => doc.data());

        const lessons: CourseLesson[] = [];
        for (let j = 0; j < lessonsData.length; j++) {
            lessons.push({
                id: lessonsSnapshot.docs[j].id,
                name: lessonsData[j].name,
                video: lessonsData[j].video,
                content: lessonsData[j].content,
                set: lessonsData[j].set
            });
        }

        chapters.push({
            id: chaptersSnapshot.docs[i].id,
            name: chaptersData[i].name,
            lessons: lessons
        });
    }

    const course: Course = {
        id: courseDoc.id,
        name: courseData.name,
        author: courseData.author,
        description: courseData.description,
        image: courseData.image,
        keywords: courseData.keywords,
        lastUpdated: courseData.lastUpdated.toDate(),
        chapters: chapters,
        published: courseData.published
    };
    courseCache[id] = course;

    return course;
};