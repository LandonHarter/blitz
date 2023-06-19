'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import styles from './page.module.css';
import { Question, QuestionType } from '@backend/live/quiz';
import generateId from '@/backend/id';
import Loading from '@/components/loading/loading';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';

export default function EditPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();
    
    const questionInput = useRef<HTMLInputElement>(null);
    const option1Input = useRef<HTMLInputElement>(null);
    const option2Input = useRef<HTMLInputElement>(null);
    const option3Input = useRef<HTMLInputElement>(null);
    const option4Input = useRef<HTMLInputElement>(null);
    const correctOptionCheckbox = useRef<HTMLSelectElement>(null);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loadingMenu, setLoadingMenu] = useState<boolean>(true);

    useEffect(() => {
        setLoadingMenu(true);
        (async () => {
            const quizRef = doc(collection(firestore, 'quizzes'), id);
            const quizSnapshot = await getDoc(quizRef);

            if (!quizSnapshot.exists()) {
                alert('Quiz does not exist');
                router.push('/');
                return;
            }

            const questionsArray:Question[] = [];

            const quizData = quizSnapshot.data();
            const quizQuestions = quizData.questions;
            for (let i = 0; i < quizData.numQuestions; i++) {
                const question = quizQuestions[i];
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
            setLoadingMenu(false);
        })();
    }, []);

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

    const updateQuiz = async () => {
        const questionRef = doc(collection(firestore, 'quizzes'), id);
        await updateDoc(questionRef, {
            questions: questions,
            numQuestions: questions.length,
        });
    };

    if (loadingMenu) {
        return(<Loading />);
    }

    return(
        <div>
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
                    await updateQuiz();
                    setLoadingMenu(false);
                }}>Update Quiz</button>
            </div>

            {questions.map((question, index) => {
                return(
                    <div key={index}>
                        <p>{question.question}</p>
                        <ul>
                            {question.options.map((option, index) => {
                                return(
                                    <li key={option.id}>{option.option} {option.correct && '(Correct Answer)'}</li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}