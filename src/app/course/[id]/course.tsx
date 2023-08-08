'use client'

import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
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
    const [finishedVerification, setFinishedVerification] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [previousLessonName, setPreviousLessonName] = useState<string>('Previous Lesson');
    const [nextLessonName, setNextLessonName] = useState<string>('Next Lesson');

    const topOfLesson = useRef<HTMLDivElement>(null);

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

    const getNextLesson = () => {
        if (!course) return {
            nextChapter: 0,
            nextLesson: 0
        }

        let nextChapter = selectedChapter;
        let nextLesson = selectedLesson + 1;

        if (selectedLesson === -1) {
            nextChapter = 0;
            nextLesson = 0;
            return {
                nextChapter,
                nextLesson
            }
        }

        const numChapters = chaptersData.length - 1;
        const numLessons = chaptersData[selectedChapter].lessons.length;

        if (nextLesson === numLessons) {
            nextChapter++;
            nextLesson = 0;

            if (nextChapter === numChapters) {
                nextChapter = -1;
                nextLesson = -1;
            }
        }

        return {
            nextChapter,
            nextLesson
        };
    }

    const getPreviousLesson = () => {
        if (!course) return {
            previousChapter: 0,
            previousLesson: 0
        }

        let previousChapter = selectedChapter;
        let previousLesson = selectedLesson - 1;

        if (selectedLesson === -1) {
            previousChapter = -1;
            previousLesson = -1;
            return {
                previousChapter,
                previousLesson
            }
        }

        if (previousLesson === -1) {
            previousChapter--;
            if (previousChapter === -1) {
                previousChapter = -2;
                previousLesson = -1;
            } else {
                previousLesson = chaptersData[previousChapter].lessons.length - 1;
            }
        }

        return {
            previousChapter,
            previousLesson
        };
    }

    const nextLesson = () => {
        if (isLastLesson() || !course) return;

        const next = getNextLesson();
        setSelectedChapter(next.nextChapter);
        setSelectedLesson(next.nextLesson);

        if (next.nextLesson === -1) return;
        const newChaptersData = [...chaptersData];
        newChaptersData[next.nextChapter].open = true;
        setChaptersData(newChaptersData);
    }

    const previousLesson = () => {
        if (selectedLesson === -1 || !course) return;

        const previous = getPreviousLesson();
        if (previous.previousChapter === -2) {
            setSelectedChapter(-1);
            setSelectedLesson(-1);
            return;
        }

        setSelectedChapter(previous.previousChapter);
        setSelectedLesson(previous.previousLesson);

        if (previous.previousLesson === -1) return;
        const newChaptersData = [...chaptersData];
        newChaptersData[previous.previousChapter].open = true;
        setChaptersData(newChaptersData);
    }

    const isLastLesson = () => {
        if (!course || selectedLesson === -1) return false;

        const numChapters = chaptersData.length;
        const numLessons = chaptersData[selectedChapter].lessons.length;
        return selectedChapter === numChapters - 1 && selectedLesson === numLessons - 1;
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
            if (!course || currentUser.empty) {
                setFinishedVerification(true);
                return;
            }

            const admin = await hasRole(currentUser.uid, Roles.ADMIN);
            const published = course.published;

            if (admin || published) {
                setFinishedVerification(true);
                setVerifiedAccess(true);
            } else {
                setFinishedVerification(true);
                setVerifiedAccess(false);
            }
        })();
    }, [course, currentUser]);

    useEffect(() => {
        if (!signedIn || !course) return;

        const nextLessonAvail = getNextLesson();
        if (nextLessonAvail.nextLesson !== -1) {
            setNextLessonName(course.chapters[nextLessonAvail.nextChapter].lessons[nextLessonAvail.nextLesson].name);
        } else {
            setNextLessonName('')
        }

        const previousLessonAvail = getPreviousLesson();
        if (previousLessonAvail.previousLesson !== -1) {
            setPreviousLessonName(course.chapters[previousLessonAvail.previousChapter].lessons[previousLessonAvail.previousLesson].name);
        } else if (previousLessonAvail.previousChapter !== -2) {
            setPreviousLessonName('')
        } else {
            setPreviousLessonName('Introduction')
        }
    }, [selectedChapter, selectedLesson]);

    if (loading || !course || !finishedVerification) {
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

                            if (selectedChapter === i) return;
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
                                }} style={{
                                    pointerEvents: chaptersData[i].open ? 'all' : 'none'
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
                <div ref={topOfLesson} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 0
                }} />
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

                <div className={styles.navigator}>
                    {previousLessonName !== '' ?
                        <div className={styles.navigator_container}>
                            <button className={styles.navigator_button} onClick={() => {
                                previousLesson();
                                topOfLesson?.current?.scrollIntoView({ behavior: 'smooth' });
                            }}><p>←</p></button>
                            <h1 className={styles.navigator_title}>{previousLessonName}</h1>
                        </div> : <div />
                    }
                    {nextLessonName !== '' ?
                        <div className={styles.navigator_container}>
                            <h1 className={styles.navigator_title}>{nextLessonName}</h1>
                            <button className={styles.navigator_button} onClick={() => {
                                nextLesson();
                                topOfLesson?.current?.scrollIntoView({ behavior: 'smooth' });
                            }}><p>→</p></button>
                        </div> : <div />
                    }
                </div>

                {(isAdmin && !editMode) && <button onClick={() => {
                    setEditMode(true);
                }} className={styles.edit_button}>Edit Course</button>}
            </div>
        </div>
    );
}