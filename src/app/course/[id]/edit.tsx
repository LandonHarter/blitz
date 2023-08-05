'use client'

import { Course } from '@/backend/course/course';
import styles from './edit.module.css';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Timestamp, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { uploadFile } from '@/backend/firebase/storage';
import generateId from '@/backend/id';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { it } from 'node:test';

export default function EditCourse(props: { course: Course, setCourse: Dispatch<SetStateAction<Course | null>>, selectedChapter: number, selectedLesson: number, setEditMode: Dispatch<SetStateAction<boolean>> }) {
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<{
        path: string,
        blob: Blob | null
    }>({
        path: '',
        blob: null
    });
    const [video, setVideo] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [set, setSet] = useState<string>('');

    const [editingType, setEditingType] = useState<'introduction' | 'chapter' | 'lesson' | null>(null);

    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const triggerSuccess = (duration: number) => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, duration * 1000);
    };

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

        let imagePath = image.path;
        if (image.blob) {
            imagePath = await uploadFile(image.blob, `course-images/${generateId()}.${image.blob.type.split('/')[1]}`);
            setImage({
                path: imagePath,
                blob: null,
            });
        }

        if (imagePath === '') {
            imagePath = 'https://dummyimage.com/900x270/bfbfbf/595959.png';
        }

        await updateDoc(courseRef, {
            name: name,
            description: content,
            image: imagePath,
            lastUpdated: Timestamp.now(),
        });

        const newCourse = { ...props.course };
        newCourse.name = name;
        newCourse.description = content;
        newCourse.image = imagePath;
        newCourse.lastUpdated = new Date();
        props.setCourse(newCourse);
    };

    const udpateChapter = async () => {
        let chapterId = props.course.chapters[props.selectedChapter].id;
        if (chapterId === 'new') {
            chapterId = await createChapter();
        }

        const chapterRef = doc(collection(firestore, `courses/${props.course.id}/chapters`), chapterId);
        await updateDoc(chapterRef, {
            name: name
        });

        const newCourse = { ...props.course };
        newCourse.chapters[props.selectedChapter].name = name;
        newCourse.chapters[props.selectedChapter].id = chapterId;
        props.setCourse(newCourse);
    };

    const updateLesson = async () => {
        if (!props.course) return;
        if (props.selectedLesson < 0) {
            await updateIntroduction();
            triggerSuccess(3);
            return;
        } else if (props.selectedLesson >= props.course.chapters[props.selectedChapter].lessons.length) {
            await udpateChapter();
            triggerSuccess(3);
            return;
        }

        const course = props.course;

        let chapterId = course.chapters[props.selectedChapter].id;

        const chapterRef = doc(collection(firestore, `courses/${props.course.id}/chapters`), chapterId);
        const chapterSnapshot = await getDoc(chapterRef);
        const isNewChapter = !chapterSnapshot.exists();
        if (isNewChapter) {
            chapterId = await createChapter();
        }
        props.course.chapters[props.selectedChapter].id = chapterId;

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
                content: content,
                set: set
            });
        } else {
            await updateDoc(lessonRef, {
                name: name,
                video: video,
                content: content,
                set: set
            });
        }

        const newCourse = { ...props.course };
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].name = name;
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].video = video;
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].content = content;
        newCourse.chapters[props.selectedChapter].lessons[props.selectedLesson].set = set;
        newCourse.lastUpdated = new Date();
        props.setCourse(newCourse);
        triggerSuccess(3);
    };

    useEffect(() => {
        if (!props.course) return;

        const isIntroduction = props.selectedLesson < 0;
        if (isIntroduction) {
            setName(props.course.name);
            setVideo('No video available for introduction');
            setContent(props.course.description);
            setSet('No set available for introduction');
            setImage({
                path: props.course.image,
                blob: null
            });
            setEditingType('introduction');

            return;
        }

        const isChapter = props.selectedLesson >= props.course.chapters[props.selectedChapter].lessons.length;
        if (isChapter) {
            setName(props.course.chapters[props.selectedChapter].name);
            setVideo('No video available for chapter');
            setContent('No content available for chapter');
            setSet('No set available for chapter');
            setImage({
                path: 'No image available for chapter',
                blob: null
            });
            setEditingType('chapter');
        } else {
            setName(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].name);
            setVideo(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].video);
            setContent(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].content);
            setSet(props.course.chapters[props.selectedChapter].lessons[props.selectedLesson].set || '');
            setImage({
                path: 'No image available for lesson',
                blob: null
            });
            setEditingType('lesson');
        }
    }, [props.course, props.selectedChapter, props.selectedLesson]);

    return (
        <div className={styles.edit_course}>
            <input className={styles.basic_input} placeholder='Lesson name...' value={name} onChange={(e) => {
                setName(e.target.value);
            }} />
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <input className={styles.basic_input} placeholder='Introduction image...' value={image.path} onChange={(e) => {
                    setImage({
                        path: e.target.value,
                        blob: null
                    });
                }} disabled={editingType !== 'introduction'} />

                <div>
                    <input type='file' id='introduction-image-file-input' accept='image/*' style={{
                        display: 'none'
                    }} onChange={(e) => {
                        if (!e.target.files) return;
                        setImage({
                            path: e.target.files[0].name,
                            blob: e.target.files[0]
                        });
                    }} />
                    <label htmlFor='introduction-image-file-input' className={styles.update_button}>
                        Upload Image
                    </label>
                </div>
            </div>
            <input className={styles.basic_input} placeholder='Lesson video...' value={video} onChange={(e) => {
                setVideo(e.target.value);
            }} disabled={editingType === 'introduction' || editingType === 'chapter'} />
            <input className={styles.basic_input} placeholder='Lesson set...' value={set} onChange={(e) => {
                setSet(e.target.value);
            }} disabled={editingType !== 'lesson'} />
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

            <AnimatePresence mode='wait'>
                {showSuccess && <motion.div initial={{ opacity: 0, right: -400 }} animate={{ opacity: 1, right: 10 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className={styles.save_message}>
                    <Image src='/images/icons/check.png' alt='check' width={40} height={40} />
                    <h1>Successfully saved course.</h1>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}