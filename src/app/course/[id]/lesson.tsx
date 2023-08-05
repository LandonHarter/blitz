'use client'

import styles from './lesson.module.css';
import { CourseLesson } from "@/backend/course/course";
import Markdown from '@/components/markdown/markdown';
import Image from 'next/image';
import Link from 'next/link';
import ReactPlayer from 'react-player';

export default function CourseLessonContent(props: { lesson: CourseLesson }) {
    return (
        <div className={styles.lesson_container}>
            <div className={styles.title_bar}>
                <h1 className={styles.lesson_title}>{props.lesson.name}</h1>
                {props.lesson.set && props.lesson.set !== '' &&
                    <Link href={props.lesson.set} target='_blank' style={{
                        textDecoration: 'none'
                    }}>
                        <button className={styles.visit_set}>
                            <Image src='/icon.png' alt='icon' width={512} height={512} className={styles.set_icon} />
                            View Set
                        </button>
                    </Link>
                }
            </div>
            <div className={styles.dashed_divider} />

            {props.lesson.video !== '' &&
                <>
                    <div className={styles.player_container}>
                        <ReactPlayer url={props.lesson.video} controls />
                    </div>
                    <div className={styles.dashed_divider} />
                </>
            }

            <article className={styles.lesson_article} style={{
                marginTop: props.lesson.video === '' ? 50 : 0
            }}>
                <Markdown text={props.lesson.content} className={styles.markdown_text} />
            </article>
        </div>
    );
}