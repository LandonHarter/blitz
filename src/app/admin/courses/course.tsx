'use client'

import { useState } from 'react';
import styles from './course.module.css';
import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { useRouter } from 'next/navigation';

export default function AdminCourseDashboard() {
    const router = useRouter();

    const [courseId, setCourseId] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [creating, setCreating] = useState<boolean>(false);

    const createCourse = async () => {
        setCreating(true);
        const courseRef = doc(collection(firestore, 'courses'), courseId);
        await setDoc(courseRef, {
            name: courseName,
            author: author,
            description: `${courseName} introduction page.`,
            image: 'https://dummyimage.com/900x270/bfbfbf/595959.png',
            lastUpdated: Timestamp.now(),
            published: false,
        });

        const chapter1Ref = doc(collection(courseRef, 'chapters'), '1');
        await setDoc(chapter1Ref, {
            name: 'Chapter 1',
        });

        const lesson1Ref = doc(collection(chapter1Ref, 'lessons'), '1');
        await setDoc(lesson1Ref, {
            name: 'Lesson 1',
            video: '',
            content: 'Lesson 1 content.',
        });

        return courseId;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create a Course</h1>

            <div className={styles.form}>
                <input className={styles.basic_input} placeholder='Course ID...' onChange={(e) => {
                    setCourseId(e.target.value);
                }} disabled={creating} />
                <input className={styles.basic_input} placeholder='Course name...' onChange={(e) => {
                    setCourseName(e.target.value);
                }} disabled={creating} />
                <input className={styles.basic_input} placeholder='Author...' onChange={(e) => {
                    setAuthor(e.target.value);
                }} disabled={creating} />
                <button className={styles.create} onClick={async () => {
                    const url = await createCourse();
                    router.push(`/course/${url}`);
                }}>Create Set</button>
            </div>
        </div>
    );
}