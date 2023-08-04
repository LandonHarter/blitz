'use client'

import styles from './lesson.module.css';
import { CourseLesson } from "@/backend/course/course";
import Markdown from '@/components/markdown/markdown';
import ReactPlayer from 'react-player';

export default function CourseLessonContent(props: { lesson: CourseLesson }) {
    return (
        <div className={styles.lesson_container}>
            <h1 className={styles.lesson_title}>{props.lesson.name}</h1>
            <div className={styles.player_container}>
                <ReactPlayer url={props.lesson.video} controls />
            </div>

            <article className={styles.lesson_article}>
                <Markdown text={props.lesson.content} />
            </article>
        </div>
    );
}