'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

import styles from './page.module.css';
import { Question, QuestionOption, QuestionType } from '@/backend/live/set';
import generateId from '@/backend/id';
import Loading from '@/components/loading/loading';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/backend/firebase/init';
import UserContext from '@/context/usercontext';

export default function EditPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();
    
    const questionInput = useRef<HTMLInputElement>(null);
    const option1Input = useRef<HTMLInputElement>(null);
    const option2Input = useRef<HTMLInputElement>(null);
    const option3Input = useRef<HTMLInputElement>(null);
    const option4Input = useRef<HTMLInputElement>(null);
    const correctOptionCheckbox = useRef<HTMLSelectElement>(null);

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [owner, setOwner] = useState<string|null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingMenu, setLoadingMenu] = useState<boolean>(true);

    const [questionsDropdownOpen, setQuestionsDropdownOpen] = useState<boolean>(true);
    const dropdownTriangleSize = 25;

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

            const questionsArray:Question[] = [];

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

                const questionElement:Question = {
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
            }

            setQuestions(questionsArray);
            setOwner(setSnapshot.data()?.owner);
            setLoadingMenu(false);
        })();
    }, [userLoading]);

    const createQuestion = () => {
        const questionText = questionInput.current?.value;
        const option1Text = option1Input.current?.value;
        const option2Text = option2Input.current?.value;
        const option3Text = option3Input.current?.value;
        const option4Text = option4Input.current?.value;
        const correctOption = correctOptionCheckbox.current?.value;

        if (!questionText || !option1Text || !option2Text || !option3Text || !option4Text) {
            alert('Please fill out all fields');
            return;
        }

        const option1 = {
            id: generateId(),
            option: option1Text,
            correct: correctOption === 'Option 1',
        };
        const option2 = {
            id: generateId(),
            option: option2Text,
            correct: correctOption === 'Option 2',
        };
        const option3 = {
            id: generateId(),
            option: option3Text,
            correct: correctOption === 'Option 3',
        };
        const option4 = {
            id: generateId(),
            option: option4Text,
            correct: correctOption === 'Option 4',
        };
        const question = {
            id: generateId(),
            type: QuestionType.MultipleChoice,
            question: questionText,
            options: [option1, option2, option3, option4],
        };

        setQuestions((oldQuestions) => [...oldQuestions, question]);

        questionInput.current!.value = '';
        option1Input.current!.value = '';
        option2Input.current!.value = '';
        option3Input.current!.value = '';
        option4Input.current!.value = '';
        correctOptionCheckbox.current!.value = 'Option 1';
    };

    const updateSet = async () => {
        const questionRef = doc(collection(firestore, 'sets'), id);
        console.log(auth.currentUser?.uid);
        await updateDoc(questionRef, {
            questions: questions,
            numQuestions: questions.length,
        });
    };

    if (loadingMenu) {
        return(<Loading />);
    }

    return(
        <div className={styles.edit_container}>
            <div className={styles.question_form}>
                <input ref={questionInput} type="text" placeholder="Question" />
                <input ref={option1Input} type="text" placeholder="Option 1" />
                <input ref={option2Input} type="text" placeholder="Option 2" />
                <input ref={option3Input} type="text" placeholder="Option 3" />
                <input ref={option4Input} type="text" placeholder="Option 4" />
                <select ref={correctOptionCheckbox}>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                </select>
                <button onClick={() => {
                    createQuestion();
                }}>Create Question</button>
                <button onClick={async () => {
                    setLoadingMenu(true);
                    await updateSet();
                    setLoadingMenu(false);
                }}>Update Set</button>
            </div>

            <div className={styles.questions}>
                <div className={styles.questions_dropdown} onClick={() => {
                    setQuestionsDropdownOpen(!questionsDropdownOpen);
                }}>
                    <svg height="25" width="25" className={`${styles.dropdown_triangle} ${questionsDropdownOpen && styles.dropdown_triangle_active}`}>
                        <polygon points={`0,0 ${dropdownTriangleSize/2},${dropdownTriangleSize} ${dropdownTriangleSize},0`} style={{ fill: '#353535' }} />
                    </svg>
                    <h1 style={{ marginLeft:20, color:'#353535' }}>Questions ({questions.length})</h1>
                </div>

                {questionsDropdownOpen && questions.map((question, index) => {
                    return(
                        <div key={index} className={styles.question}>
                            <h1>{question.question}</h1>

                            <div className={styles.question_options}>
                                {question.options.map((option, index) => {
                                    return(
                                        <div key={option.id} className={`${styles.question_option} ${option.correct && styles.question_option_correct}`} onClick={() => {
                                            option.correct = !option.correct;
                                            setQuestions([...questions]);
                                        }}>
                                            <p>{option.option}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div> 
        </div>
    );
}