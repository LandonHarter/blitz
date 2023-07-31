'use client'

import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';

import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { Question, QuestionType, duplicateSet, getSet, likeSet, unlikeSet } from '@/backend/set';
import Loading from '@/components/loading/loading';
import Image from 'next/image';
import Link from 'next/link';
import BasicReturn from '@/components/basic-return/return';
import UserContext from '@/context/usercontext';
import { createClassicGame } from '@/backend/live/game';
import Popup from '@/components/popup/popup';
import { AnimatePresence, motion } from 'framer-motion';
import OptionDropdown from './mcq';
import ShortAnswerDropdown from './sa';
import { HeartSVG, ThreeDotsSVG } from '@/svg';
import FlashcardAnswerDropdown from './flashcard';
import DarkModeContext from '@/context/darkmode';
import AnimationDiv from '@/animation/AnimationDiv';
import 'cooltipz-css';

export default function SetContent() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const [set, setSet] = useState<any>(null);
    const [author, setAuthor] = useState<any>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [questionsOpen, setQuestionsOpen] = useState<boolean[]>([]);

    const [threeDots, setThreeDots] = useState(false);

    const { currentUser, signedIn, updateUserData, userLoading } = useContext(UserContext);
    const { get: darkMode } = useContext(DarkModeContext);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const [shareOpen, setShareOpen] = useState(false);

    const getQuestionUI = (question: Question) => {
        if (question.type === QuestionType.MultipleChoice || question.type === QuestionType.TrueFalse) {
            return (<OptionDropdown question={question} />);
        } else if (question.type === QuestionType.ShortAnswer) {
            return (<ShortAnswerDropdown question={question} />);
        } else if (question.type === QuestionType.Flashcard) {
            return (<FlashcardAnswerDropdown question={question} />);
        }

        return (<></>);
    };

    useEffect(() => {
        if (!id) {
            router.push('/');
            return;
        }

        (async () => {
            const setData: any = await getSet(id);
            if (!setData) {
                router.push('/');
                return;
            }

            setSet(setData);
            setQuestionsOpen(new Array(setData.questions.length).fill(false));

            const authorRef = doc(collection(firestore, 'users'), setData.owner);
            const authorData = await getDoc(authorRef);
            setAuthor(authorData.data());

            if (!userLoading) setIsLiked((currentUser.likedSets || {})[setData.id] || false);

            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (set) {
            setIsLiked((currentUser.likedSets || {})[set.id] || false);
        }
    }, [signedIn]);

    if (loading || !set) {
        return (<Loading />);
    }

    if (!set.public) {
        return (<BasicReturn text='This set is not public' returnLink='/explore/sets' />)
    }

    return (
        <div className={styles.set_container}>
            <div className={styles.side_bar}>
                <div className={styles.set_image} style={{ backgroundImage: `url('${set.image}')` }} />
                <h1 className={styles.set_name}>{set.name}</h1>
                <p className={styles.set_description}>{set.description}</p>

                <div className={styles.set_stats}>
                    <div>
                        <div onClick={() => {
                            if (!signedIn) {
                                setError('You must be signed in to like a set.');
                                setErrorOpen(true);
                                return;
                            }

                            if (isLiked) {
                                setIsLiked(false);
                                const newSet = { ...set };
                                newSet.likes--;
                                setSet(newSet);

                                unlikeSet(set.id, currentUser, updateUserData);
                            } else {
                                setIsLiked(true);
                                const newSet = { ...set };
                                newSet.likes++;
                                setSet(newSet);

                                likeSet(set.id, currentUser, updateUserData);
                            }
                        }}>
                            <HeartSVG className={`${styles.like_icon} ${isLiked && styles.like_icon_liked}`} />
                        </div>
                        <p className={styles.like_count}>{set.likes} Like{set.likes !== 1 && 's'}</p>
                    </div>
                    <div className={styles.dots_container}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer'
                            }} aria-label='Share' data-cooltipz-dir="top"><Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/share.png`} alt='share' width={30} height={30}
                                className={styles.share_icon} onClick={() => {
                                    setShareOpen(true);
                                }} /></button>
                            <ThreeDotsSVG className={styles.dots} onClick={() => {
                                setThreeDots(!threeDots);
                            }} />
                        </div>


                        <div style={{ position: 'relative' }}>
                            <AnimatePresence mode='wait'>

                                {threeDots &&
                                    <AnimationDiv className={styles.dots_popup} animation={{
                                        initial: {
                                            transformOrigin: 'top',
                                            scaleY: 0.6,
                                            opacity: 0
                                        },
                                        animate: {
                                            transformOrigin: 'top',
                                            scaleY: 1,
                                            opacity: 1
                                        },
                                        exit: {
                                            transformOrigin: 'top',
                                            scaleY: 0.6,
                                            opacity: 0
                                        }
                                    }} duration={0.1}>
                                        <div className={styles.dots_popup_option} onClick={async () => {
                                            setThreeDots(false);

                                            const newSet = await duplicateSet(set.id, currentUser, updateUserData);
                                            if (newSet) {
                                                router.push(`/set/${newSet}`);
                                            } else {
                                                setError('Something went wrong while duplicating the set. Please try again later.');
                                                setErrorOpen(true);
                                            }
                                        }}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/copy.png`} alt='icon' width={30} height={30} />
                                            <h1>Clone Set</h1>
                                        </div>
                                    </AnimationDiv>
                                }
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
                <Link href={`/profile/${author.uid}`} style={{ width: '100%', textDecoration: 'none' }}>
                    <div className={styles.author_container}>
                        <Image className={styles.author_pfp} src={author.pfp} alt='pfp' width={40} height={40} />
                        <h1 className={styles.author_name}>{author.name}</h1>
                    </div>
                </Link>
                <div className={styles.action_buttons}>
                    <Link href={`/study/${set.id}`} className={styles.link_button_container}><button className={styles.study_button}>Study</button></Link>
                    <button className={styles.host_button} onClick={async () => {
                        if (!signedIn) {
                            setError('You must be signed in to host a live game.');
                            setErrorOpen(true);
                            return;
                        }

                        setLoading(true);
                        const {
                            success,
                            error,
                            gameCode
                        } = await createClassicGame(currentUser.uid, set.id);

                        if (success) {
                            router.push(`/host/${gameCode}`);
                        } else {
                            setError(error);
                            setErrorOpen(true);
                            setLoading(false);
                        }
                    }}>Host Live</button>
                </div>
            </div>
            <div className={styles.questions_container}>
                {set.questions.map((question: Question, index: number) => {
                    return (
                        <motion.div key={index} className={styles.question} onClick={() => {
                            const newQuestionsOpen = [...questionsOpen];
                            newQuestionsOpen[index] = !newQuestionsOpen[index];
                            setQuestionsOpen(newQuestionsOpen);
                        }} initial={{ height: 43 }} animate={{ height: questionsOpen[index] ? 'fit-content' : 43 }} transition={{ duration: 0.2 }}>
                            <div className={styles.question_header}>
                                <h1 className={styles.question_title}>{question.question}</h1>
                            </div>

                            <AnimatePresence mode='wait'>
                                {questionsOpen[index] &&
                                    <AnimationDiv className={styles.question_content} animation={{
                                        initial: {
                                            transformOrigin: 'top',
                                            scaleY: 0,
                                            opacity: 0
                                        },
                                        animate: {
                                            transformOrigin: 'top',
                                            scaleY: 1,
                                            opacity: 1
                                        },
                                        exit: {
                                            transformOrigin: 'top',
                                            scaleY: 0,
                                            opacity: 0
                                        }
                                    }} duration={0.2}>
                                        {getQuestionUI(question)}
                                    </AnimationDiv>
                                }
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <Popup open={shareOpen} setOpen={setShareOpen} exitButton>
                <h1 className={styles.share_title}>Share</h1>

                <div className={styles.share_buttons}>
                    <button onClick={() => {
                        window.open("https://twitter.com/share?url=" + encodeURIComponent(window.location.href) + "&text=" + `Study ${set.name} on Blitz!`, '_blank');
                        setShareOpen(false);
                    }} className={styles.button_share} aria-label='Twitter' data-cooltipz-dir='top'><Image src='/images/providers/twitter-share.webp' alt='twitter' width={50} height={50} /></button>
                    <button onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
                        setShareOpen(false);
                    }} className={styles.button_share} aria-label='Facebook' data-cooltipz-dir='top'><Image src='/images/providers/fb-share.webp' alt='twitter' width={50} height={50} /></button>
                    <button onClick={() => {
                        window.open(`mailto:?subject=Study ${set.name} on Blitz!&body=${window.location.href}`, '_blank');
                        setShareOpen(false);
                    }} className={styles.button_share} aria-label='Email' data-cooltipz-dir='top'><Image src='/images/providers/email-share.webp' alt='twitter' width={50} height={50} /></button>
                    <button onClick={() => {
                        window.open(`https://www.reddit.com/submit?url=${window.location.href}&title=${set.name}`, '_blank');
                        setShareOpen(false);
                    }} className={styles.button_share} aria-label='Reddit' data-cooltipz-dir='top'><Image src='/images/providers/reddit-share.webp' alt='twitter' width={50} height={50} /></button>
                </div>
                <div className={styles.link_container}>
                    <input className={styles.share_link} value={window.location.href} />
                    <button className={styles.copy_button} onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}><Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/copy.png`} alt='' width={25} height={25} /></button>
                </div>
                <div style={{ marginBottom: 50 }} />
            </Popup>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className='popup_error'>{error}</h1>
            </Popup>
        </div>
    );
}