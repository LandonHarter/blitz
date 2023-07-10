'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

import styles from './page.module.css';
import { Question, QuestionType } from '@/backend/live/set';
import generateId from '@/backend/id';
import Loading from '@/components/loading/loading';
import { Timestamp, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import UserContext from '@/context/usercontext';
import { getUserData } from '@/backend/firebase/user';
import Popup from '@/components/popup/popup';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { arrayMove } from '@/backend/util';

export default function EditPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [owner, setOwner] = useState<string | null>(null);
    const [set, setSet] = useState<any>(null);
    const [tempSet, setTempSet] = useState<{
        name: string,
        description: string,
    }>({ name: '', description: '' });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingMenu, setLoadingMenu] = useState<boolean>(true);

    const [errorOpen, setErrorOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const dropdownTriangleSize = 25;
    const [questionUiData, setQuestionUiData] = useState<{
        open: boolean,
        showShifters: boolean
    }[]>([]);

    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (userLoading) return;

        if (!signedIn) {
            router.push(`/set/${id}`);
        }

        if (owner !== null) {
            if (owner !== currentUser.uid) {
                router.push(`/set/${id}`);
                return;
            }
        }

        setLoadingMenu(true);
        (async () => {
            const setRef = doc(collection(firestore, 'sets'), id);
            const setSnapshot = await getDoc(setRef);

            if (!setSnapshot.exists()) {
                alert('Set does not exist');
                router.push('/');
                return;
            }

            if (!signedIn || (signedIn && currentUser.uid !== setSnapshot.data()?.owner)) {
                router.push(`/set/${id}`);
                return;
            }

            const questionsArray: Question[] = [];
            const questionUiDataArray: any[] = [];

            const setData = setSnapshot.data();
            const setQuestionsArray = setData.questions;
            for (let i = 0; i < setData.numQuestions; i++) {
                const question = setQuestionsArray[i];
                const type = question.type;
                const options = question.options;
                const option1 = options[0];
                const option2 = options[1];
                const option3 = options[2];
                const option4 = options[3];

                const questionElement: Question = {
                    id: question.id,
                    question: question.question,
                    type: QuestionType[type as keyof typeof QuestionType],
                    options: [
                        {
                            option: option1.option,
                            correct: option1.correct,
                            id: option1.id,
                        },
                        {
                            option: option2.option,
                            correct: option2.correct,
                            id: option2.id,
                        },
                        {
                            option: option3.option,
                            correct: option3.correct,
                            id: option3.id,
                        },
                        {
                            option: option4.option,
                            correct: option4.correct,
                            id: option4.id,
                        }
                    ],
                };

                questionsArray.push(questionElement);
                questionUiDataArray.push({
                    open: false,
                    showShifters: false
                });
            }

            setSet(setSnapshot.data());
            setTempSet({
                name: setData.name,
                description: setData.description,
            });
            setQuestions(questionsArray);
            setQuestionUiData(questionUiDataArray);
            setOwner(setSnapshot.data()?.owner);
            setLoadingMenu(false);
        })();
    }, [userLoading]);

    const triggerSuccess = (duration: number) => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, duration * 1000);
    };

    const createQuestion = () => {
        const emptyOption = {
            option: '',
            correct: false,
            id: generateId(),
        };
        const question = {
            id: generateId(),
            type: QuestionType.MultipleChoice,
            question: '',
            options: [emptyOption, emptyOption, emptyOption, emptyOption],
        };

        setQuestions((oldQuestions) => [...oldQuestions, question]);
        setQuestionUiData((oldQuestionUiData) => [...oldQuestionUiData, {
            open: true,
            showShifters: false
        }]);
    };

    const checkQuestionsValidity = () => {
        let valid = true;
        questions.forEach((question) => {
            if (question.question === '') {
                console.log("invalid: " + question.id);
                valid = false;
            }

            question.options.forEach((option) => {
                if (option.option === '') {
                    console.log("invalid: " + option.id);
                    valid = false;
                }
            });
        });

        return valid;
    };

    const updateSet = async () => {
        if (tempSet.name === '' || !checkQuestionsValidity()) {
            setError('Invalid: Empty fields');
            setErrorOpen(true);
            return;
        }

        const questionRef = doc(collection(firestore, 'sets'), id);
        await updateDoc(questionRef, {
            questions: questions,
            numQuestions: questions.length,
            updatedAt: serverTimestamp(),
            name: tempSet.name,
            description: tempSet.description,
        });

        const userSetsArray = (await getUserData(currentUser.uid)).sets;
        const setIndex = userSetsArray.findIndex((set) => set.id === id);
        userSetsArray[setIndex].updatedAt = Timestamp.now();
        await updateDoc(doc(collection(firestore, 'users'), currentUser.uid), {
            sets: userSetsArray,
        });

        triggerSuccess(5);
    };

    const colorFromIndex = (index: number) => {
        const colors = [styles.option_red, styles.option_blue, styles.option_green, styles.option_yellow];
        return colors[index];
    };

    if (loadingMenu) {
        return (<Loading />);
    }

    return (
        <div className={styles.edit_container}>
            <div className={styles.data_container}>
                <h1 className={styles.set_title}>{set.name}</h1>

                <div className={styles.divider} />

                <div className={styles.name_input_container}>
                    <h1 className={styles.name_input_title}>Name</h1>
                    <input className={styles.name_input} placeholder='Set Name' value={tempSet.name} onChange={(e) => {
                        setTempSet((prevData) => ({
                            name: e.target.value,
                            description: prevData.description,
                        }));
                    }} />
                </div>
                <div className={styles.desc_input_container}>
                    <h1 className={styles.desc_input_title}>Description</h1>
                    <textarea className={styles.desc_input} placeholder='Set Description' value={tempSet.description} onChange={(e) => {
                        setTempSet((prevData) => ({
                            name: prevData.name,
                            description: e.target.value,
                        }));
                    }} />
                </div>
                <button className={styles.update_set} onClick={() => {
                    updateSet();
                }}>Save</button>
            </div>
            <div className={styles.questions_container}>
                {questions.map((question, index) => (
                    <div key={index} className={styles.question_container} onMouseOver={(e) => {
                        const newQuestionsData = [...questionUiData];
                        newQuestionsData[index].showShifters = true;
                        setQuestionUiData(newQuestionsData);
                    }} onMouseOut={(e) => {
                        const newQuestionsData = [...questionUiData];
                        newQuestionsData[index].showShifters = false;
                        setQuestionUiData(newQuestionsData);
                    }}>
                        <AnimatePresence mode='wait'>
                            {questionUiData[index].showShifters ?
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className={styles.shift_question_buttons}>
                                    <Image src='/images/icons/shifter.png' className={styles.shift_button} alt='arrow' width={25} height={25} style={{ rotate: '180deg' }} onClick={() => {
                                        if (index === 0) return;

                                        setQuestions(arrayMove([...questions], index, index - 1));
                                        setQuestionUiData(arrayMove([...questionUiData], index, index - 1));
                                    }} />
                                    <Image src='/images/icons/shifter.png' className={styles.shift_button} alt='arrow' width={25} height={25} onClick={() => {
                                        if (index === questions.length - 1) return;
                                        setQuestions(arrayMove([...questions], index, index + 1));
                                        setQuestionUiData(arrayMove([...questionUiData], index, index + 1));
                                    }} />
                                </motion.div> : <div className={styles.empty_shifter_space} />
                            }
                        </AnimatePresence>
                        <motion.div initial={{ height: 93, opacity: 0, scaleY: 0.3 }} animate={{ height: questionUiData[index].open ? 355 : 93, opacity: 1, scaleY: 1 }}
                            className={styles.question}>
                            <div className={styles.question_topbar}>
                                <svg height="25" width="25" className={`${styles.dropdown_triangle} ${!questionUiData[index].open && styles.dropdown_triangle_closed}`} onClick={() => {
                                    const newQuestionsData = [...questionUiData];
                                    newQuestionsData[index].open = !newQuestionsData[index].open;
                                    setQuestionUiData(newQuestionsData);
                                }}>
                                    <polygon points={`0,0 ${dropdownTriangleSize / 2},${dropdownTriangleSize} ${dropdownTriangleSize},0`} style={{ fill: '#353535' }} />
                                </svg>
                                <input className={styles.question_input} placeholder='Question here' value={question.question} onChange={(e) => {
                                    question.question = e.target.value;
                                    setQuestions((oldQuestions) => [...oldQuestions]);
                                }} />
                            </div>
                            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: questionUiData[index].open ? 1 : 0 }} className={styles.options_container}>
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className={`${styles.option} ${colorFromIndex(optionIndex)}`}>
                                        <input className={styles.inp_cbx} id={`correct-${question.options[optionIndex].id}`} type="checkbox" style={{ display: 'none' }} checked={option.correct} onChange={(e) => {
                                            option.correct = e.target.checked;
                                            setQuestions((oldQuestions) => [...oldQuestions]);
                                        }} />
                                        <label className={styles.cbx} htmlFor={`correct-${question.options[optionIndex].id}`}>
                                            <span>
                                                <svg width="12px" height="9px" viewBox="0 0 12 9">
                                                    <polyline points="1 5 4 8 11 1"></polyline>
                                                </svg>
                                            </span>
                                        </label>
                                        <input className={styles.option_input} placeholder={`Option ${optionIndex + 1}`} value={option.option} onChange={(e) => {
                                            option.option = e.target.value;
                                            setQuestions((oldQuestions) => [...oldQuestions]);
                                        }} />
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
                <motion.div whileTap={{ translateY: '380px' }} className={`${styles.question} ${styles.add_question}`} onClick={() => {
                    createQuestion();
                }}>
                    <h1 className={styles.add_symbol}>+</h1>
                </motion.div>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_content}>{error}</h1>
            </Popup>
            <AnimatePresence mode='wait'>
                {showSuccess && <motion.div initial={{ opacity: 0, right: -400 }} animate={{ opacity: 1, right: 10 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className={styles.save_message}>
                    <Image src='/images/icons/check.png' alt='error' width={40} height={40} />
                    <h1>Successfully saved set.</h1>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}