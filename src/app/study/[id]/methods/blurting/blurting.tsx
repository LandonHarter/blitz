'use client'

import { Dispatch, SetStateAction, useContext, useState } from "react";
import styles from './blurting.module.css';
import { formatTimestampDate } from "@/backend/util";
import { AnimatePresence, motion } from "framer-motion";
import AnimationDiv from "@/animation/AnimationDiv";
import { fade } from "@/animation/animation";
import ReactMarkdown from "react-markdown";
import { Timestamp } from "firebase/firestore";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';
import { StudyMethod, updateStudyData } from "@/backend/firebase/study";
import UserContext from "@/context/usercontext";
import RequireSignInStudyMethod from "../needsignin";
import StudyMethodContainer from "../studymethod";

export default function BlurtingStudyMethod(props: { set: any, studyData: any, setStudyData: Dispatch<SetStateAction<any>> }) {
    const [writing, setWriting] = useState(true);
    const [currentBlurt, setCurrentBlurt] = useState<any>();

    const [blurtText, setBlurtText] = useState('');
    const { currentUser } = useContext(UserContext);

    const Blurt = (props: { blurt: any }) => {
        return (
            <div className={`${styles.blurt} ${currentBlurt === props.blurt && styles.blurt_selected}`} onClick={() => {
                setWriting(false);
                setCurrentBlurt(props.blurt);
            }}>
                <h1>{formatTimestampDate(props.blurt.createdAt)}</h1>
                <p>{props.blurt.text}</p>
            </div>
        );
    };

    return (
        <StudyMethodContainer>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={styles.past_blurts}>
                    {props.studyData.blurts.map((blurt: any, index: number) => {
                        return (<Blurt key={index} blurt={blurt} />);
                    })}

                    <div className={styles.blurt_new} onClick={() => {
                        setWriting(true);
                        setCurrentBlurt(undefined);
                    }}>
                        <h1>+</h1>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <AnimatePresence mode='wait'>
                        {writing &&
                            <AnimationDiv className={styles.new_blurt_section} animation={fade} duration={0.1}>
                                <textarea className={styles.blurt_input} placeholder="Write your blurt here..." onChange={(e) => {
                                    setBlurtText(e.target.value);
                                }} />
                                <button className={styles.save_blurt} onClick={async () => {
                                    if (blurtText === '') return;

                                    const newBlurt = {
                                        text: blurtText,
                                        createdAt: Timestamp.now()
                                    };
                                    props.setStudyData({
                                        ...props.studyData,
                                        blurting: {
                                            blurts: [...props.studyData.blurts, newBlurt]
                                        }
                                    });

                                    setCurrentBlurt(newBlurt);
                                    setWriting(false);
                                    setBlurtText('');

                                    await updateStudyData(props.set.id, StudyMethod.Blurting, currentUser.uid, {
                                        blurts: [...props.studyData.blurts, newBlurt]
                                    });
                                }}>Save</button>
                            </AnimationDiv>
                        }
                    </AnimatePresence>
                    <AnimatePresence mode='wait'>
                        {!writing &&
                            <AnimationDiv className={styles.selected_blurt_section} animation={fade} duration={0.1}>
                                <h1 className={styles.blurt_title}>{formatTimestampDate(currentBlurt.createdAt)}</h1>
                                <ReactMarkdown className={styles.blurt_content} components={{
                                    p: ({ children }) => <p className={styles.blurt_p}>{children}</p>,
                                    h1: ({ children }) => <h1 className={styles.blurt_h1}>{children}</h1>,
                                    h2: ({ children }) => <h2 className={styles.blurt_h2}>{children}</h2>,
                                    h3: ({ children }) => <h3 className={styles.blurt_h3}>{children}</h3>,
                                    h4: ({ children }) => <h4 className={styles.blurt_h4}>{children}</h4>,
                                    li: ({ children }) => <li className={styles.blurt_li}>{children}</li>,
                                    ul: ({ children }) => <ul className={styles.blurt_ul}>{children}</ul>,
                                    ol: ({ children }) => <ol className={styles.blurt_ol}>{children}</ol>,
                                    span: ({ children }) => <span className={styles.blurt_span}>{children[0]}</span>,
                                    img: ({ src }) => <><img className={styles.blurt_img} src={src} /><br /></>,
                                    a: ({ children, href }) => <a className={styles.blurt_a} href={href} target="_blank">{children}</a>
                                }} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{currentBlurt.text}</ReactMarkdown>
                            </AnimationDiv>
                        }
                    </AnimatePresence>
                </div>
            </div>
        </StudyMethodContainer>
    );
}