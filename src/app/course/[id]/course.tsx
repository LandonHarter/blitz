'use client'

import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import Markdown from '@/components/markdown/markdown';
import { Course, CourseChapter, getCourse } from '@/backend/course/course';
import { set } from 'firebase/database';
import Loading from '@/components/loading/loading';
import CourseLessonContent from './lesson';
import EditCourse from './edit';
import { Roles, hasRole } from '@/backend/firebase/roles';
import UserContext from '@/context/usercontext';
import BasicReturn from '@/components/basic-return/return';

export default function CourseContent() {
    const id = usePathname().split('/')[2];
    const [course, setCourse] = useState<Course | null>(null);

    const [chaptersData, setChaptersData] = useState<{
        open: boolean,
        lessons: {
            completed: boolean,
        }[],
    }[]>([]);
    const [lessonsData, setLessonsData] = useState<{
        completed: boolean,
    }[]>([]);

    const [selectedChapter, setSelectedChapter] = useState<number>(0);
    const [selectedLesson, setSelectedLesson] = useState<number>(-1);

    const [editMode, setEditMode] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { currentUser, signedIn } = useContext(UserContext);

    const [verifiedAccess, setVerifiedAccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const introduction = () => {
        if (!course) return (<></>);
        return (
            <>
                <div className={styles.course_image} style={{
                    backgroundImage: `url(${course.image})`
                }} />

                <div className={styles.course_content}>
                    <h1 className={styles.course_title}>{course.name}</h1>
                    <h2 className={styles.course_author}>Written by {course.author}</h2>
                    <Markdown text={course.description} className={styles.course_description} />
                </div>
            </>
        );
    }

    useEffect(() => {
        (async () => {
            const courseData = await getCourse(id);
            if (!courseData) return;

            setCourse(courseData);
            const chaptersData = courseData.chapters.map((chapter: CourseChapter) => {
                const lessons: { completed: boolean }[] = [];
                for (let i = 0; i < chapter.lessons.length; i++) {
                    lessons.push({
                        completed: localStorage.getItem(`course-${id}-chapter-${chapter.id}-lesson-${i}-completed`) === 'true'
                    });
                }

                return {
                    open: false, lessons: lessons
                };
            });

            const introDone = (localStorage.getItem(`course-${id}-intro-done`) || 'false') === 'true';
            chaptersData.push({
                open: false,
                lessons: [
                    { completed: introDone }
                ]
            });

            setChaptersData(chaptersData);
            setLessonsData(lessonsData);
            setSelectedChapter(chaptersData.length - 1);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!signedIn) return;
        (async () => {
            const admin = await hasRole(currentUser.uid, Roles.ADMIN);
            setIsAdmin(admin);
        })();
    }, [signedIn]);

    useEffect(() => {
        (async () => {
            if (!course || currentUser.empty) return;

            const admin = await hasRole(currentUser.uid, Roles.ADMIN);
            const published = course.published;

            if (!published && !admin) {
                return;
            }

            setVerifiedAccess(true);
        })();
    }, [course, currentUser]);

    if (loading || !course) {
        return (<Loading />);
    }

    if (!verifiedAccess) {
        return (<BasicReturn text="You do not have access to course." returnLink='/explore/courses' />)
    }

    return (
        <div className={styles.course_page}>
            <div className={styles.sidebar}>
                <div className={`${styles.sidebar_chapter} ${selectedChapter === chaptersData.length - 1 && styles.sidebar_item_selected}`} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }} onClick={() => {
                    setSelectedChapter(chaptersData.length - 1);
                    setSelectedLesson(-1);
                }}>
                    <input className={styles.inp_cbx} id={`completed-intro`} type="checkbox" style={{ display: 'none' }} checked={chaptersData[chaptersData.length - 1].lessons[0].completed} onChange={(e) => {
                        const newChaptersData = [...chaptersData];
                        newChaptersData[newChaptersData.length - 1].lessons[0].completed = e.target.checked;
                        setChaptersData(newChaptersData);

                        localStorage.setItem(`course-${id}-intro-done`, e.target.checked ? 'true' : 'false');
                    }} />
                    <label className={styles.cbx} htmlFor={`completed-intro`}>
                        <span>
                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                <polyline points="1 5 4 8 11 1"></polyline>
                            </svg>
                        </span>
                    </label>
                    <h1 className={styles.sidebar_chapter_title} style={{
                        marginLeft: 10
                    }}>Introduction</h1>
                </div>
                {course.chapters.map((chapter, i) => (
                    <div className={`${styles.sidebar_chapter} ${selectedChapter === i && styles.sidebar_item_selected}`} key={i}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }} onClick={() => {
                            const newChaptersData = [...chaptersData];
                            newChaptersData[i].open = !newChaptersData[i].open;
                            setChaptersData(newChaptersData);

                            console.log(i);

                            setSelectedChapter(i);
                            setSelectedLesson(0);
                        }}>
                            <svg height="15" width="15" className={`${styles.dropdown_triangle} ${!chaptersData[i].open && styles.dropdown_triangle_closed}`}>
                                <polygon points={`0,0 ${15 / 2},${15} ${15},0`} style={{ fill: `var(--text-color${selectedChapter !== i ? '-light' : ''})` }} />
                            </svg>
                            <h1 className={styles.sidebar_chapter_title}>{chapter.name}</h1>
                        </div>

                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: chaptersData[i].open ? 'fit-content' : 0, opacity: chaptersData[i].open ? 1 : 0, scaleY: chaptersData[i].open ? 1 : 0.5 }} style={{
                            transformOrigin: 'top',
                            marginTop: '10px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            {editMode &&
                                <div className={`${styles.sidebar_lesson} ${styles.add_lesson}`} onClick={() => {
                                    setSelectedChapter(i);
                                    setSelectedLesson(chapter.lessons.length);
                                }}>
                                    <h2 className={styles.sidebar_lesson_title}>Edit Chapter</h2>
                                </div>
                            }
                            {chapter.lessons.map((lesson, j) => (
                                <div className={`${styles.sidebar_lesson} ${selectedLesson === j && selectedChapter === i && styles.sidebar_selected_lesson}`} key={j} onClick={() => {
                                    setSelectedLesson(j);
                                    setSelectedChapter(i);
                                }}>
                                    <input className={styles.inp_cbx} id={`completed-chapter-${i}-lesson-${j}`} type="checkbox" style={{ display: 'none' }} checked={chaptersData[i].lessons[j].completed} onChange={(e) => {
                                        const newChaptersData = [...chaptersData];
                                        newChaptersData[i].lessons[j].completed = e.target.checked;
                                        setChaptersData(newChaptersData);

                                        localStorage.setItem(`course-${id}-chapter-${chapter.id}-lesson-${j}-completed`, e.target.checked ? 'true' : 'false');
                                    }} />
                                    <label className={styles.cbx} htmlFor={`completed-chapter-${i}-lesson-${j}`}>
                                        <span>
                                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                                <polyline points="1 5 4 8 11 1"></polyline>
                                            </svg>
                                        </span>
                                    </label>
                                    <h2 className={styles.sidebar_lesson_title}>{lesson.name}</h2>
                                </div>
                            ))}
                            {editMode &&
                                <div className={`${styles.sidebar_lesson} ${styles.add_lesson}`} onClick={() => {
                                    const newCourse = { ...course };
                                    newCourse.chapters[i].lessons.push({
                                        name: 'New Lesson',
                                        video: '',
                                        content: '',
                                        id: 'new'
                                    });

                                    const newChaptersData = [...chaptersData];
                                    newChaptersData[i].lessons.push({
                                        completed: false
                                    });

                                    setChaptersData(newChaptersData);
                                    setCourse(newCourse);

                                    setSelectedChapter(i);
                                    setSelectedLesson(newCourse.chapters[i].lessons.length - 1);
                                }}>
                                    <h2 className={styles.sidebar_lesson_title}>Add Lesson</h2>
                                </div>
                            }
                        </motion.div>
                    </div>
                ))}
                {editMode &&
                    <div className={`${styles.sidebar_chapter} ${styles.add_chapter}`} onClick={() => {
                        const newCourse = { ...course };
                        newCourse.chapters.push({
                            name: 'New Chapter',
                            lessons: [{
                                name: 'New Lesson',
                                video: '',
                                content: '',
                                id: 'new'
                            }],
                            id: 'new'
                        });

                        const newChaptersData = [...chaptersData];
                        newChaptersData.push({
                            open: false,
                            lessons: [{
                                completed: false
                            }]
                        });

                        setChaptersData(newChaptersData);
                        setCourse(newCourse);

                        setSelectedChapter(newCourse.chapters.length - 1);
                        setSelectedLesson(0);
                    }}>
                        <h2 className={styles.sidebar_chapter_title}>Add Chapter</h2>
                    </div>
                }
            </div>
            <div className={styles.course}>
                {
                    editMode ? <EditCourse course={course} setCourse={setCourse} selectedChapter={selectedChapter} selectedLesson={selectedLesson} setEditMode={setEditMode} /> :
                        (selectedLesson === -1
                            ? introduction()
                            : (selectedLesson < course.chapters[selectedChapter].lessons.length
                                ? <CourseLessonContent lesson={course.chapters[selectedChapter].lessons[selectedLesson]} />
                                : <h1>Chapter page</h1>
                            )
                        )
                }

                {(isAdmin && !editMode) && <button onClick={() => {
                    setEditMode(true);
                }} className={styles.edit_button}>Edit Course</button>}
            </div>
        </div>
    );
}