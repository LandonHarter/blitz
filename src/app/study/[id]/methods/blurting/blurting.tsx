'use client'

import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
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
import 'cooltipz-css';
import { EditSVG, TrashSVG } from "@/svg";
import Image from "next/image";
import DarkModeContext from "@/context/darkmode";

export default function BlurtingStudyMethod(props: { set: any, studyData: any, setStudyData: Dispatch<SetStateAction<any>> }) {
    const [writing, setWriting] = useState(true);
    const [currentBlurt, setCurrentBlurt] = useState<any>();

    const [blurtText, setBlurtText] = useState('');
    const [blurtViewMode, setBlurtViewMode] = useState<'edit' | 'preview'>('edit');
    const blurtInputRef = useRef<HTMLTextAreaElement>(null);
    const { currentUser } = useContext(UserContext);
    const { get: darkMode } = useContext(DarkModeContext);

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

    const insertText = (text: string, moveCursor: number = 0) => {
        if (!blurtInputRef.current) return;

        const selectionStart = blurtInputRef.current.selectionStart;
        const selectionEnd = blurtInputRef.current.selectionEnd;
        const value = blurtInputRef.current.value;

        const newValue = value.substring(0, selectionStart) + text + value.substring(selectionEnd, value.length);
        blurtInputRef.current.value = newValue;
        blurtInputRef.current.selectionStart = selectionStart + moveCursor;
        blurtInputRef.current.selectionEnd = selectionStart + moveCursor;
        blurtInputRef.current.focus();

        setBlurtText(newValue);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.past_blurts}>
                {props.studyData.blurts.map((blurt: any, index: number) => {
                    return (<Blurt key={index} blurt={blurt} />);
                })}

                <div className={styles.blurt_new} onClick={() => {
                    setWriting(true);
                    setCurrentBlurt(undefined);
                    setBlurtText('');
                }}>
                    <h1>+</h1>
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%' }}>
                <AnimatePresence mode='wait'>
                    {writing &&
                        <div className={styles.edit_container}>
                            <AnimationDiv className={styles.new_blurt_section} animation={fade} duration={0.1}>
                                <motion.div className={styles.writing_controls} initial={{ width: 'calc(100% + 20px)' }} animate={{ width: `calc(${(blurtViewMode === 'edit' ? '100%' : '50%')} + 20px)` }}>
                                    <div className={styles.writing_snippets}>
                                        <button onClick={() => {
                                            insertText('# ', 2);
                                        }} aria-label='Heading' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/heading.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('****', 2);
                                        }} aria-label='Bold' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/bold.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('**', 1);
                                        }} aria-label='Italic' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/italic.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('- ', 2);
                                        }} aria-label='Unordered List' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/list.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('1. ', 3);
                                        }} aria-label='Numbered List' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/number-list.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('![image alt text]()', 18);
                                        }} aria-label='Image' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/image.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('$$  $$', 3);
                                        }} aria-label='Math Expression' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/math.png`} alt='insert' width={35} height={35} />
                                        </button>
                                    </div>
                                    <div className={styles.writing_viewing_mode}>
                                        <button className={`${styles.view_mode_button} ${blurtViewMode === 'edit' && styles.view_mode_selected}`} onClick={() => { setBlurtViewMode('edit') }}>Edit</button>
                                        <button className={`${styles.view_mode_button} ${blurtViewMode === 'preview' && styles.view_mode_selected}`} onClick={() => { setBlurtViewMode('preview') }}>Preview</button>
                                    </div>
                                </motion.div>
                                <motion.textarea className={styles.blurt_input} placeholder="Start blurting..." value={blurtText} onChange={(e) => {
                                    setBlurtText(e.target.value);
                                }} ref={blurtInputRef} initial={{ width: '100%' }} animate={{ width: (blurtViewMode === 'edit' ? '100%' : '50%') }} />
                                <button className={styles.save_blurt} onClick={async () => {
                                    if (blurtText === '') return;

                                    if (!currentBlurt) {
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
                                    } else {
                                        const newBlurts = [...props.studyData.blurts];
                                        const index = newBlurts.indexOf(currentBlurt);
                                        newBlurts[index] = {
                                            ...currentBlurt,
                                            text: blurtText
                                        };
                                        props.setStudyData({
                                            ...props.studyData,
                                            blurting: {
                                                blurts: newBlurts
                                            }
                                        });

                                        setCurrentBlurt({
                                            ...currentBlurt,
                                            text: blurtText
                                        });
                                        setWriting(false);
                                        setBlurtText('');

                                        await updateStudyData(props.set.id, StudyMethod.Blurting, currentUser.uid, {
                                            blurts: newBlurts
                                        });
                                    }
                                }}>Save</button>
                            </AnimationDiv>
                            <motion.div className={styles.editor_preview}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: blurtViewMode === 'edit' ? 0 : 1, opacity: blurtViewMode === 'edit' ? 0 : 1 }}
                                transition={{ duration: 0.275 }}
                            >
                                <ReactMarkdown className={styles.blurt_content} components={{
                                    p: ({ children }) => <p className={styles.blurt_p}>{children}</p>,
                                    h1: ({ children }) => <h1 className={styles.blurt_h1}>{children}</h1>,
                                    h2: ({ children }) => <h2 className={styles.blurt_h2}>{children}</h2>,
                                    h3: ({ children }) => <h3 className={styles.blurt_h3}>{children}</h3>,
                                    h4: ({ children }) => <h4 className={styles.blurt_h4}>{children}</h4>,
                                    h5: ({ children }) => <h5 className={styles.blurt_h5}>{children}</h5>,
                                    h6: ({ children }) => <h6 className={styles.blurt_h6}>{children}</h6>,
                                    li: ({ children }) => <li className={styles.blurt_li}>{children}</li>,
                                    ul: ({ children }) => <ul className={styles.blurt_ul}>{children}</ul>,
                                    ol: ({ children }) => <ol className={styles.blurt_ol}>{children}</ol>,
                                    span: ({ children }) => <span className={styles.blurt_span}>{children[0]}</span>,
                                    img: ({ src }) => <><img className={styles.blurt_img} src={src} /><br /></>,
                                    a: ({ children, href }) => <a className={styles.blurt_a} href={href} target="_blank">{children}</a>
                                }} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{blurtText}</ReactMarkdown>
                            </motion.div>
                        </div>
                    }
                </AnimatePresence>
                <AnimatePresence mode='wait'>
                    {!writing &&
                        <AnimationDiv className={styles.selected_blurt_section} animation={fade} duration={0.1}>
                            <div className={styles.blurt_top_row}>
                                <h1 className={styles.blurt_title}>{formatTimestampDate(currentBlurt.createdAt)}</h1>
                                <EditSVG className={styles.edit_blurt} onClick={() => {
                                    setWriting(true);
                                    setBlurtText(currentBlurt.text);
                                }} />
                                <TrashSVG className={styles.delete_blurt} onClick={async () => {
                                    const newBlurts = [...props.studyData.blurts];
                                    const index = newBlurts.indexOf(currentBlurt);
                                    newBlurts.splice(index, 1);
                                    props.setStudyData({
                                        ...props.studyData,
                                        blurting: {
                                            blurts: newBlurts
                                        }
                                    });

                                    setWriting(true);
                                    setBlurtText('');
                                    setCurrentBlurt(undefined);

                                    await updateStudyData(props.set.id, StudyMethod.Blurting, currentUser.uid, {
                                        blurts: newBlurts
                                    });
                                }} />
                            </div>
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
    );
}