'use client'

import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';

import { useRouter, usePathname } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import { Question, QuestionType, Set, likeSet, unlikeSet } from '@/backend/live/set';
import Loading from '@/components/loading/loading';
import Image from 'next/image';
import Link from 'next/link';
import BasicReturn from '@/components/basic-return/return';
import UserContext from '@/context/usercontext';
import { createGame } from '@/backend/live/game';
import Popup from '@/components/popup/popup';
import { AnimatePresence, motion } from 'framer-motion';
import OptionDropdown from './mcq';
import ShortAnswerDropdown from './sa';
import { HeartSVG } from '@/svg';

export default function SetPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const [set, setSet] = useState<any>();
    const [author, setAuthor] = useState<any>();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [questionsOpen, setQuestionsOpen] = useState<boolean[]>([]);

    const { currentUser, signedIn, userLoading, updateUserData } = useContext(UserContext);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    const getQuestionUI = (question: Question) => {
        if (question.type === QuestionType.MultipleChoice || question.type === QuestionType.TrueFalse) {
            return (<OptionDropdown question={question} />);
        } else if (question.type === QuestionType.Flashcard || question.type === QuestionType.ShortAnswer) {
            return (<ShortAnswerDropdown question={question} />);
        }

        return (<></>);
    };

    useEffect(() => {
        if (!id) {
            router.push('/');
            return;
        }

        (async () => {
            const setRef = doc(collection(firestore, 'sets'), id);
            const setData = await getDoc(setRef);

            if (!setData.exists()) {
                router.push('/');
                return;
            }

            const set = setData.data();
            setSet({
                id: setData.id,
                name: set.name,
                description: set.description,
                image: set.image,
                questions: set.questions as Question[],
                likes: set.likes,
                numQuestions: set.numQuestions,
                createdAt: set.createdAt,
                updatedAt: set.updatedAt,
                public: set.public,
            });
            setQuestionsOpen(new Array(set.questions.length).fill(false));

            const authorRef = doc(collection(firestore, 'users'), set.owner);
            const authorData = await getDoc(authorRef);
            setAuthor(authorData.data());

            const likedSets = authorData.data()?.likedSets || [];
            setIsLiked(likedSets.includes(setData.id));

            setLoading(false);
        })();
    }, []);

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
                <Link href={`/profile/${author.uid}`} style={{ width: '100%' }}>
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
                        } = await createGame(currentUser.uid, set.id);

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
                        }}>
                            <div className={styles.question_header}>
                                <h1 className={styles.question_title}>{question.question}</h1>
                            </div>

                            <AnimatePresence mode='wait'>
                                {questionsOpen[index] &&
                                    <div className={styles.question_content}>
                                        {getQuestionUI(question)}
                                    </div>
                                }
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>
        </div>
    );
}