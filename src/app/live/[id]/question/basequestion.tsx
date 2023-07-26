'use  client'

import { Question } from '@/backend/set';
import styles from './basequestion.module.css';

export default function ClientBaseQuestion(props: { question: Question, children: any }) {
    return (
        <div className={styles.question_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.question_title}>{props.question.question}</h1>
                {(props.question.photo !== '') &&
                    <div className={styles.question_photo} style={{ backgroundImage: `url('${props.question.photo}'` }} />
                }
            </div>

            <div className={styles.bottom_bar}>
                {props.children}
            </div>
        </div>
    );
}