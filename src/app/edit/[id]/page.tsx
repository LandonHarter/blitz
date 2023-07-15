'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import styles from './page.module.css';
import { Question, QuestionType, emptyFlashcardQuestion, emptyMultipleChoiceQuestion, emptyQuestion, emptyShortAnswerQuestion, emptyTrueFalseQuestion } from '@/backend/live/set';
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
import MultipleChoiceQuestion from './question-types/mcq';
import TrueFalseQuestion from './question-types/tf';
import { LockSVG, TrashSVG } from '@/svg';
import ShortAnswerQuestion from './question-types/shortanswer';
import FlashcardQuestion from './question-types/flashcard';

export default function EditPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [owner, setOwner] = useState<string | null>(null);
    const [set, setSet] = useState<any>(null);
    const [tempSet, setTempSet] = useState<{
        name: string,
        description: string,
        scramble: boolean,
    }>({ name: '', description: '', scramble: false });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingMenu, setLoadingMenu] = useState<boolean>(true);

    const [errorOpen, setErrorOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const dropdownTriangleSize = 25;
    const [questionUiData, setQuestionUiData] = useState<{
        open: boolean,
        showShifters: boolean,
        showTrash: boolean
    }[]>([]);

    const [questionSettings, setQuestionSettings] = useState<{
        open: boolean,
        questionIndex: number
    }>({ open: false, questionIndex: 0 });
    const [questionTypePopup, setQuestionTypePopup] = useState<boolean>(false);

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
                const questionContent = question.question;
                const type: QuestionType = QuestionType[question.type as keyof typeof QuestionType];
                const options = question.options;


                let questionElement = emptyQuestion;
                if (type === QuestionType.TrueFalse) {
                    questionElement = {
                        id: question.id,
                        type: type,
                        question: questionContent,
                        options: [
                            {
                                option: 'True',
                                correct: options[0].correct,
                                id: options[0].id,
                                optionData: options[0].optionData || {},
                            },
                            {
                                option: 'False',
                                correct: options[1].correct,
                                id: options[1].id,
                                optionData: options[1].optionData || {},
                            },
                        ],
                    };
                } else if (type === QuestionType.MultipleChoice) {
                    questionElement = {
                        id: question.id,
                        type: type,
                        question: questionContent,
                        options: [
                            {
                                option: options[0].option,
                                correct: options[0].correct,
                                id: options[0].id,
                                optionData: options[0].optionData || {},
                            },
                            {
                                option: options[1].option,
                                correct: options[1].correct,
                                id: options[1].id,
                                optionData: options[1].optionData || {},
                            },
                            {
                                option: options[2].option,
                                correct: options[2].correct,
                                id: options[2].id,
                                optionData: options[2].optionData || {},
                            },
                            {
                                option: options[3].option,
                                correct: options[3].correct,
                                id: options[3].id,
                                optionData: options[3].optionData || {},
                            },
                        ],
                    };
                } else if (type === QuestionType.ShortAnswer) {
                    questionElement = {
                        id: question.id,
                        type: type,
                        question: questionContent,
                        options: [
                            {
                                option: options[0].option,
                                correct: false,
                                id: options[0].id,
                                optionData: options[0].optionData || { correctAnswers: [] },
                            }
                        ],
                    }
                } else if (type === QuestionType.Flashcard) {
                    questionElement = {
                        id: question.id,
                        type: type,
                        question: questionContent,
                        options: [
                            {
                                option: options[0].option,
                                correct: false,
                                id: options[0].id,
                                optionData: options[0].optionData || { answer: "" },
                            }
                        ],
                    };
                }

                questionElement.questionLength = question.questionLength || 15;

                questionsArray.push(questionElement);
                questionUiDataArray.push({
                    open: false,
                    showShifters: false,
                    showTrash: false,
                });
            }

            setSet(setSnapshot.data());
            setTempSet({
                name: setData.name,
                description: setData.description,
                scramble: setData.scramble,
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

    const createQuestion = (type: QuestionType) => {
        let question: Question;
        if (type === QuestionType.TrueFalse) {
            question = emptyTrueFalseQuestion();
        } else if (type === QuestionType.MultipleChoice) {
            question = emptyMultipleChoiceQuestion();
        } else if (type === QuestionType.ShortAnswer) {
            question = emptyShortAnswerQuestion();
        } else if (type === QuestionType.Flashcard) {
            question = emptyFlashcardQuestion();
        } else {
            question = emptyQuestion;
        }

        setQuestions((oldQuestions) => [...oldQuestions, question]);
        setQuestionUiData((oldQuestionUiData) => [...oldQuestionUiData, {
            open: true,
            showShifters: false,
            showTrash: false
        }]);
    };

    const checkQuestionsValidity = () => {
        for (let index = 0; index < questions.length; index++) {
            const question = questions[index];
            if (question.question === '') {
                return {
                    valid: false,
                    invalidField: `Question ${index + 1}`,
                };
            }

            for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
                const option = question.options[optionIndex];

                if (question.type === QuestionType.ShortAnswer) {
                    const correctOptions = option.optionData.correctAnswers;
                    if (correctOptions.length === 0) {
                        return {
                            valid: false,
                            invalidField: `Question ${index + 1}`,
                        };
                    }

                    for (let correctOptionIndex = 0; correctOptionIndex < correctOptions.length; correctOptionIndex++) {
                        const correctOption = correctOptions[correctOptionIndex];
                        if (correctOption === '') {
                            return {
                                valid: false,
                                invalidField: `Question ${index + 1}`,
                            };
                        }
                    }
                } else if (question.type === QuestionType.Flashcard) {
                    const answer = option.optionData.answer;
                    if (answer === '') {
                        return {
                            valid: false,
                            invalidField: `Question ${index + 1}`,
                        };
                    }
                } else {
                    if (option.option === '') {
                        return {
                            valid: false,
                            invalidField: `Question ${index + 1}`
                        };
                    }
                }

            }
        };

        return {
            valid: true,
            invalidField: '',
        };
    };

    const updateSet = async () => {
        const { valid, invalidField } = checkQuestionsValidity();
        if (tempSet.name === '' || !valid) {
            setError(`Invalid: ${invalidField}`);
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
            scramble: tempSet.scramble
        });

        const userSetsArray = (await getUserData(currentUser.uid)).sets;
        const setIndex = userSetsArray.findIndex((set) => set.id === id);
        userSetsArray[setIndex].updatedAt = Timestamp.now();
        await updateDoc(doc(collection(firestore, 'users'), currentUser.uid), {
            sets: userSetsArray,
        });

        triggerSuccess(5);
    };

    const getPlaceholder = (type: QuestionType) => {
        if (type === QuestionType.Flashcard) {
            return "Term here";
        } else if (type === QuestionType.TrueFalse) {
            return "Statement here";
        }

        return "Question here";
    };

    const getQuestionUIFromType = (question: Question, index: number) => {
        if (question.type === QuestionType.MultipleChoice) {
            return (
                <MultipleChoiceQuestion question={question} questionIndex={index}
                    questionUiData={questionUiData} setQuestions={setQuestions} settingsPopup={setQuestionSettings} />
            );
        } else if (question.type === QuestionType.TrueFalse) {
            return (
                <TrueFalseQuestion question={question} questionIndex={index}
                    questionUiData={questionUiData} setQuestions={setQuestions} />
            );
        } else if (question.type === QuestionType.ShortAnswer) {
            return (
                <ShortAnswerQuestion question={question} questionIndex={index}
                    questionUiData={questionUiData} setQuestions={setQuestions} />
            );
        } else if (question.type === QuestionType.Flashcard) {
            return (
                <FlashcardQuestion question={question} questionIndex={index}
                    questionUiData={questionUiData} setQuestions={setQuestions} />
            );
        }

        return (<></>);
    };

    const QuestionTypeBox = (props: { children: any, title: string, questionType: QuestionType }) => {
        return (
            <div className={styles.question_type_checkbox} onClick={() => {
                createQuestion(props.questionType);
                setQuestionTypePopup(false);
            }}>
                <label className={styles.question_type_checkbox_wrapper}>
                    <span className={styles.question_type_checkbox_tile}>
                        <span className={styles.question_type_checkbox_icon}>
                            {props.children}
                        </span>
                        <span className={styles.question_type_checkbox_label}>{props.title}</span>
                    </span>
                </label>
            </div>
        );
    }

    if (loadingMenu) {
        return (<Loading />);
    }

    return (
        <div className={styles.edit_container}>
            <div className={styles.data_container}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {!set.public && <LockSVG className={styles.lock} />}
                    <h1 className={styles.set_title}>{set.name}</h1>
                </div>

                <div className={styles.divider} />

                <div className={styles.name_input_container}>
                    <h1 className={styles.name_input_title}>Name</h1>
                    <input className={styles.name_input} placeholder='Set Name' value={tempSet.name} onChange={(e) => {
                        setTempSet((prevData) => ({
                            name: e.target.value,
                            description: prevData.description,
                            scramble: prevData.scramble
                        }));
                    }} />
                </div>
                <div className={styles.desc_input_container}>
                    <h1 className={styles.desc_input_title}>Description</h1>
                    <textarea className={styles.desc_input} placeholder='Set Description' value={tempSet.description} onChange={(e) => {
                        setTempSet((prevData) => ({
                            name: prevData.name,
                            description: e.target.value,
                            scramble: prevData.scramble
                        }));
                    }} />
                </div>
                <label className={`${styles.toggle} ${styles.scramble_questions}`} htmlFor={`scramble-questions`}>
                    <input type="checkbox" className={styles.toggle__input} id={`scramble-questions`} checked={tempSet.scramble} />
                    <span className={styles.toggle_track} onClick={() => {
                        setTempSet((prevData) => ({
                            name: prevData.name,
                            description: prevData.description,
                            scramble: !prevData.scramble
                        }));
                    }}>
                        <span className={styles.toggle_indicator}>
                            <span className={styles.checkMark}>
                                <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
                                    <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
                                </svg>
                            </span>
                        </span>
                    </span>
                    <p className={styles.toggle_text}>Scramble Questions</p>
                </label>
                <button className={styles.update_set} onClick={() => {
                    updateSet();
                }}>Save</button>
            </div>
            <div className={styles.questions_container}>
                {questions.map((question, index) => (
                    <div key={index} className={styles.question_container} onMouseOver={() => {
                        const newQuestionsData = [...questionUiData];
                        newQuestionsData[index].showShifters = true;
                        newQuestionsData[index].showTrash = true;
                        setQuestionUiData(newQuestionsData);
                    }} onMouseOut={() => {
                        const newQuestionsData = [...questionUiData];
                        newQuestionsData[index].showShifters = false;
                        newQuestionsData[index].showTrash = false;
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
                        <motion.div initial={{ height: 93, opacity: 0, scaleY: 0.3 }} animate={{ height: questionUiData[index].open ? 'fit-content' : 93, opacity: 1, scaleY: 1 }}
                            className={styles.question}>
                            <div className={styles.question_topbar}>
                                <svg height="25" width="25" className={`${styles.dropdown_triangle} ${!questionUiData[index].open && styles.dropdown_triangle_closed}`} onClick={() => {
                                    const newQuestionsData = [...questionUiData];
                                    newQuestionsData[index].open = !newQuestionsData[index].open;
                                    setQuestionUiData(newQuestionsData);
                                }}>
                                    <polygon points={`0,0 ${dropdownTriangleSize / 2},${dropdownTriangleSize} ${dropdownTriangleSize},0`} style={{ fill: '#353535' }} />
                                </svg>
                                <input className={styles.question_input} placeholder={getPlaceholder(question.type)} value={question.question} onChange={(e) => {
                                    question.question = e.target.value;
                                    setQuestions((oldQuestions) => [...oldQuestions]);
                                }} />
                                <AnimatePresence mode='wait'>
                                    {questionUiData[index].showTrash && <motion.div initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} onClick={() => {
                                        const newQuestions = [...questions];
                                        newQuestions.splice(index, 1);
                                        setQuestions(newQuestions);

                                        const newQuestionsData = [...questionUiData];
                                        newQuestionsData.splice(index, 1);
                                        setQuestionUiData(newQuestionsData);
                                    }}><TrashSVG className={styles.delete_question} /></motion.div>}
                                </AnimatePresence>
                            </div>

                            {getQuestionUIFromType(question, index)}
                        </motion.div>
                    </div>
                ))}
                <motion.div className={`${styles.question} ${styles.add_question}`} onClick={() => {
                    setQuestionTypePopup(true);
                }}>
                    <h1 className={styles.add_symbol}>+</h1>
                </motion.div>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_content}>{error}</h1>
            </Popup>
            <Popup open={questionTypePopup} setOpen={setQuestionTypePopup} exitButton>
                <>
                    <h1 className={styles.question_types_title}>Question Types</h1>
                    <div className={styles.question_type_container}>
                        <QuestionTypeBox title='MCQ' questionType={QuestionType.MultipleChoice}>
                            <svg width="192px" height="192px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M8 42H32C33.1046 42 34 41.1046 34 40V8C34 6.89543 33.1046 6 32 6H8C6.89543 6 6 6.89543 6 8V40C6 41.1046 6.89543 42 8 42ZM32 44H8C5.79086 44 4 42.2091 4 40V8C4 5.79086 5.79086 4 8 4H32C34.2091 4 36 5.79086 36 8V40C36 42.2091 34.2091 44 32 44Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M18 13C18 12.4477 18.4477 12 19 12H31C31.5523 12 32 12.4477 32 13C32 13.5523 31.5523 14 31 14H19C18.4477 14 18 13.5523 18 13Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M18 17C18 16.4477 18.4477 16 19 16H31C31.5523 16 32 16.4477 32 17C32 17.5523 31.5523 18 31 18H19C18.4477 18 18 17.5523 18 17Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M18 25C18 24.4477 18.4477 24 19 24H31C31.5523 24 32 24.4477 32 25C32 25.5523 31.5523 26 31 26H19C18.4477 26 18 25.5523 18 25Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M18 29C18 28.4477 18.4477 28 19 28H31C31.5523 28 32 28.4477 32 29C32 29.5523 31.5523 30 31 30H19C18.4477 30 18 29.5523 18 29Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M10 26V29H13V26H10ZM9 24H14C14.5523 24 15 24.4477 15 25V30C15 30.5523 14.5523 31 14 31H9C8.44772 31 8 30.5523 8 30V25C8 24.4477 8.44772 24 9 24Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.7071 12.2929C16.0976 12.6834 16.0976 13.3166 15.7071 13.7071L11 18.4142L8.29289 15.7071C7.90237 15.3166 7.90237 14.6834 8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929L11 15.5858L14.2929 12.2929C14.6834 11.9024 15.3166 11.9024 15.7071 12.2929Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M42 24H40V39.3333L41 40.6667L42 39.3333V24ZM44 40L41 44L38 40V22H44V40Z" fill="#333333" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M42 17H40V19H42V17ZM40 15H42C43.1046 15 44 15.8954 44 17V21H38V17C38 15.8954 38.8954 15 40 15Z" fill="#333333" />
                            </svg>
                        </QuestionTypeBox>
                        <QuestionTypeBox title='True False' questionType={QuestionType.TrueFalse}>
                            <svg fill="#000000" height="192px" width="192px"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M13.4,3.00283H2.6a1.6,1.6,0,0,0-1.6,1.6v6.8a1.5952,1.5952,0,0,0,1.6,1.59434H13.4A1.5952,1.5952,0,0,0,15,11.40283v-6.8A1.6,1.6,0,0,0,13.4,3.00283Zm-5.81256,3.577H6.141v3.73593H4.94647V6.57978H3.5V5.6839H7.58744ZM12.5,6.58017H10.36918v.86166h1.97529V8.3377H10.36918v1.9784H9.1809V5.68429H12.5Z" />
                            </svg>
                        </QuestionTypeBox>
                        <QuestionTypeBox title='Short Answer' questionType={QuestionType.ShortAnswer}>
                            <svg fill="#000000" width="800px" height="800px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
                                <title>chat-bubble-line</title>
                                <path d="M18,2.5c-8.82,0-16,6.28-16,14s7.18,14,16,14a18,18,0,0,0,4.88-.68l5.53,3.52a1,1,0,0,0,1.54-.84l0-6.73a13,13,0,0,0,4-9.27C34,8.78,26.82,2.5,18,2.5ZM28.29,24.61a1,1,0,0,0-.32.73l0,5.34-4.38-2.79a1,1,0,0,0-.83-.11A16,16,0,0,1,18,28.5c-7.72,0-14-5.38-14-12s6.28-12,14-12,14,5.38,14,12A11.08,11.08,0,0,1,28.29,24.61Z"></path>
                                <path d="M25,15.5H11a1,1,0,0,0,0,2H25a1,1,0,0,0,0-2Z" />
                                <path d="M21.75,20.5h-7.5a1,1,0,0,0,0,2h7.5a1,1,0,0,0,0-2Z" />
                                <path d="M11.28,12.5H24.72a1,1,0,0,0,0-2H11.28a1,1,0,0,0,0,2Z" />
                                <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                            </svg>
                        </QuestionTypeBox>
                        <QuestionTypeBox title='Flashcard' questionType={QuestionType.Flashcard}>
                            <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.3116 12.6473L20.8293 10.7154C21.4335 8.46034 21.7356 7.3328 21.5081 6.35703C21.3285 5.58657 20.9244 4.88668 20.347 4.34587C19.6157 3.66095 18.4881 3.35883 16.2331 2.75458C13.978 2.15033 12.8504 1.84821 11.8747 2.07573C11.1042 2.25537 10.4043 2.65945 9.86351 3.23687C9.27709 3.86298 8.97128 4.77957 8.51621 6.44561C8.43979 6.7254 8.35915 7.02633 8.27227 7.35057L8.27222 7.35077L7.75458 9.28263C7.15033 11.5377 6.84821 12.6652 7.07573 13.641C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 10.0957 16.6392 12.3508 17.2435L12.3508 17.2435C14.3834 17.7881 15.4999 18.0873 16.415 17.9744C16.5152 17.9621 16.6129 17.9448 16.7092 17.9223C17.4796 17.7427 18.1795 17.3386 18.7203 16.7612C19.4052 16.0299 19.7074 14.9024 20.3116 12.6473Z" stroke="#1C274C" strokeWidth="1.5" />
                                <path d="M16.415 17.9741C16.2065 18.6126 15.8399 19.1902 15.347 19.6519C14.6157 20.3368 13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1495 6.87466 21.922C6.10421 21.7424 5.40432 21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7151C2.15033 12.46 1.84821 11.3325 2.07573 10.3567C2.25537 9.58627 2.65945 8.88638 3.23687 8.34557C3.96815 7.66065 5.09569 7.35853 7.35077 6.75428C7.77741 6.63996 8.16368 6.53646 8.51621 6.44531" stroke="#1C274C" strokeWidth="1.5" />
                                <path d="M11.7769 10L16.6065 11.2941" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M11 12.8975L13.8978 13.6739" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </QuestionTypeBox>
                    </div>
                </>
            </Popup>
            <Popup open={questionSettings.open} close={() => {
                setQuestionSettings({ open: false, questionIndex: 0 });
            }} exitButton>
                {questionSettings.open &&
                    <>
                        <label className={styles.toggle} htmlFor='scramble-options'>
                            <input type="checkbox" className={styles.toggle__input} id='scramble-options' checked={questions[questionSettings.questionIndex].scramble} />
                            <span className={styles.toggle_track} onClick={() => {
                                questions[questionSettings.questionIndex].scramble = !questions[questionSettings.questionIndex].scramble;
                                setQuestions([...questions]);
                            }}>
                                <span className={styles.toggle_indicator}>
                                    <span className={styles.checkMark}>
                                        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
                                            <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
                                        </svg>
                                    </span>
                                </span>
                            </span>
                            <p className={styles.toggle_text}>Scramble Options</p>
                        </label>
                        <label className={styles.number_input_container} id='question-length'>
                            <input type="number" className={styles.number_input} id='question-length' value={questions[questionSettings.questionIndex].questionLength} onChange={(e) => {
                                let newNumber = Number.parseInt(e.target.value);
                                if (newNumber > 99) return;

                                questions[questionSettings.questionIndex].questionLength = newNumber;
                                setQuestions([...questions]);
                            }} min={1} max={99} />
                            <p className={styles.toggle_text}>Duration (seconds)</p>
                        </label>
                    </>
                }
                <div style={{ marginBottom: 30 }} />
            </Popup>
            <AnimatePresence mode='wait'>
                {showSuccess && <motion.div initial={{ opacity: 0, right: -400 }} animate={{ opacity: 1, right: 10 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className={styles.save_message}>
                    <Image src='/images/icons/check.png' alt='error' width={40} height={40} />
                    <h1>Successfully saved set.</h1>
                </motion.div>}
            </AnimatePresence>
        </div >
    );
}