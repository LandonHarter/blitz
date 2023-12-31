'use client'

import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import styles from './blurting.module.css';
import { formatTimestampDate } from "@/backend/util";
import { AnimatePresence, motion } from "framer-motion";
import AnimationDiv from "@/animation/AnimationDiv";
import { fade } from "@/animation/animation";
import { Timestamp } from "firebase/firestore";
import 'katex/dist/katex.min.css';
import { StudyMethod, updateStudyData } from "@/backend/firebase/study";
import UserContext from "@/context/usercontext";
import 'cooltipz-css';
import { EditSVG, TrashSVG } from "@/svg";
import Image from "next/image";
import DarkModeContext from "@/context/darkmode";
import Markdown from "@/components/markdown/markdown";

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

    const insertText = (text: string, cursorStart: number = 0, cursorEnd: number = 0) => {
        if (!blurtInputRef.current) return;

        const selectionStart = blurtInputRef.current.selectionStart;
        const selectionEnd = blurtInputRef.current.selectionEnd;
        const value = blurtInputRef.current.value;

        const newValue = value.substring(0, selectionStart) + text + value.substring(selectionEnd, value.length);
        blurtInputRef.current.value = newValue;
        blurtInputRef.current.selectionStart = selectionStart + cursorStart;
        blurtInputRef.current.selectionEnd = selectionStart + cursorStart + cursorEnd;
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
                                            insertText('# Heading', 2, 7);
                                        }} aria-label='Heading' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/heading.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('**bold words**', 2, 10);
                                        }} aria-label='Bold' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/bold.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('*italic words*', 1, 12);
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
                                            insertText('![Link Text](url)', 13, 3);
                                        }} aria-label='Link' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/link.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('![Image Alternate Text](url)', 24, 3);
                                        }} aria-label='Image' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/image.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('$ x^2 $', 2, 3);
                                        }} aria-label='Math Expression' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/math.png`} alt='insert' width={35} height={35} />
                                        </button>
                                        <button onClick={() => {
                                            insertText('```js\nconsole.log("Hello World!");\n ```', 6, 28);
                                        }} aria-label='Code Snippet' data-cooltipz-dir="top" className={styles.snippet}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/code.png`} alt='insert' width={35} height={35} />
                                        </button>
                                    </div>
                                    <div className={styles.writing_viewing_mode}>
                                        <button className={`${styles.view_mode_button} ${blurtViewMode === 'edit' && styles.view_mode_selected}`} onClick={() => { setBlurtViewMode('edit') }}>Edit</button>
                                        <button className={`${styles.view_mode_button} ${blurtViewMode === 'preview' && styles.view_mode_selected}`} onClick={() => { setBlurtViewMode('preview') }}>Preview</button>
                                    </div>
                                </motion.div>
                                <motion.textarea className={styles.blurt_input} placeholder="Start blurting..." value={blurtText} onChange={(e) => {
                                    setBlurtText(e.target.value);
                                }} ref={blurtInputRef} initial={{ width: '100%' }} animate={{ width: (blurtViewMode === 'edit' ? '100%' : '50%') }}
                                    spellCheck={false} autoCorrect='off' autoCapitalize="off" autoComplete="off" />
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
                                <Markdown text={blurtText} />
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
                            <Markdown text={currentBlurt.text} />
                        </AnimationDiv>
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}