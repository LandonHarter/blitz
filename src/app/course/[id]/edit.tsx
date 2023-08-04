'use client'

import { Course } from '@/backend/course/course';
import styles from './edit.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Timestamp, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';

export default function EditCourse(props: { course: Course, setCourse: Dispatch<SetStateAction<Course | null>>, selectedChapter: number, selectedLesson: number, setEditMode: Dispatch<SetStateAction<boolean>> }) {
    const [name, setName] = useState<string>('');
    const [video, setVideo] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [editingType, setEditingType] = useState<'introduction' | 'chapter' | 'lesson' | null>(null);

    const createChapter = async () => {
        const chapterRef = doc(collection(firestore, `courses/${props.course.id}/chapters`), props.course.chapters.length.toString());
        await setDoc(chapterRef, {
            name: 'New Chapter'
        });

        return props.course.chapters.length.toString();
    }

    const updateIntroduction = async () => {
        const course = props.course;
        const courseRef = doc(collection(firestore, 'courses'), course.id);
        await updateDoc(courseRef, {
            name: name,
            description: content,
            lastUpdated: Timestamp.now(),
        });

        const newCourse = { ...props.course };
        newCourse.name = name;
        newCourse.description = content;
        newCourse.lastUpdated = new Date();
        props.setCourse(newCourse);
    };

    const udpateChapter = async () => {
        const chapterRef = doc(collection(firestore, `courses/${props.course.id}/chapters`), props.course.chapters[props.selectedChapter].id);
        await updateDoc(chapterRef, {
            name: name
        });

        const newCourse = { ...props.course };
        newCourse.chapters[props.selectedChapter].name = name;
        props.setCourse(newCourse);
    };

    const updateLesson = async () => {
        if (!props.course) return;
        if (props.selectedLesson < 0) {
            await updateIntroduction();
            return;
        } else if (props.selectedLesson >= props.course.chapters[props.selectedChapter].lessons.length) {
            await udpateChapter();
            return;
        }

        const course = props.course;

        let chapterId = course.chapters[props.selectedChapter].id;
        const isNewChapter = chapterId === 'new';
        if (isNewChapter) {
            chapterId = await createChapter();
        }

        const courseRef = doc(collection(firestore, 'courses'), course.id);

        const isNewLesson = props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].id === 'new';
        const lessonId = isNewLesson ? course.chapters[props.selectedChapter].lessons.length.toString() : course.chapters[props.selectedChapter].lessons[props.selectedLesson].id;
        course.chapters[props.selectedChapter].lessons[props.selectedLesson].id = lessonId;

        const lessonRef = doc(collection(firestore, `courses/${course.id}/chapters/${chapterId}/lessons`), lessonId);
        await updateDoc(courseRef, {
            lastUpdated: Timestamp.now()
        });

        if (isNewLesson) {
            await setDoc(lessonRef, {
                name: name,
                video: video,
                content: content
            });
        } else {
            await updateDoc(lessonRef, {
                name: name,
                video: video,
                content: content
            });
        }

        const newCourse = { ...props.course };
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].name = name;
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].video = video;
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].content = content;
        newCourse.lastUpdated = new Date();
        props.setCourse(newCourse);
    };

    useEffect(() => {
        if (!props.course) return;

        const isIntroduction = props.selectedLesson < 0;
        if (isIntroduction) {
            setName(props.course.name);
            setVideo('No video available for introduction');
            setContent(props.course.description);
            setEditingType('introduction');
            return;
        }

        const isChapter = props.selectedLesson >= props.course.chapters[props.selectedChapter].lessons.length;
        if (isChapter) {
            setName(props.course.chapters[props.selectedChapter].name);
            setVideo('No video available for chapter');
            setContent('No content available for chapter');
            setEditingType('chapter');
        } else {
            setName(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].name);
            setVideo(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].video);
            setContent(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].content);
            setEditingType('lesson');
        }
    }, [props.course, props.selectedChapter, props.selectedLesson]);

    return (
        <div className={styles.edit_course}>
            <input className={styles.basic_input} placeholder='Lesson name...' value={name} onChange={(e) => {
                setName(e.target.value);
            }} />
            <input className={styles.basic_input} placeholder='Lesson video...' value={video} onChange={(e) => {
                setVideo(e.target.value);
            }} disabled={editingType === 'introduction' || editingType === 'chapter'} />
            <textarea className={styles.basic_textarea} placeholder='Lesson content...' value={content} onChange={(e) => {
                setContent(e.target.value);
            }} disabled={editingType === 'chapter'} />

            <div>
                <button className={styles.update_button} onClick={async () => {
                    await updateLesson();
                }}>Update Course</button>
                <button className={styles.update_button} onClick={() => {
                    props.setEditMode(false);
                    setEditingType(null);
                }}>Stop Editing</button>
            </div>
        </div>
    );
}