'use client'

import { useState } from 'react';
import styles from './page.module.css';
import AILoading from '@/components/ai-loading/loading';

import { httpsCallable, getFunctions, HttpsCallableResult } from '@firebase/functions';
import { generateText } from '@/backend/ai/generate';
import { AIState } from '@/backend/ai/AIState';
import Popup from '@/components/popup/popup';
import Image from 'next/image';
import { parseWorksheet } from '@/backend/ai/convert';

export default function WorksheetCreatorPage() {
    const [title, setTitle] = useState('');
    const [prompt, setPrompt] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [generating, setGenerating] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);

    if (generating) {
        return(<AILoading />);
    }

    return(
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Worksheet Creator</h1>

                <input className={styles.title_input} maxLength={30} placeholder='Type title here...' value={title} onChange={(e) => {
                    setTitle(e.target.value);
                }} />

                <textarea className={styles.prompt_textarea} value={prompt} onChange={(e) => {
                    setPrompt(e.target.value);
                }} maxLength={100} placeholder='Type prompt here...' />

                <div className={styles.question_num}>
                    <div className={styles.quantity}>
                        <input className={styles.number_input} type="number" min={1} max={5} step={1} value={numQuestions} onChange={() => {}} />
                            <div className={styles.quantity_nav}>
                                <div className={`${styles.quantity_button} ${styles.quantity_up}`} onClick={() => {
                                    if (numQuestions >= 5) return;

                                    setNumQuestions((prevNumQuestions) => prevNumQuestions + 1);
                                }}>+</div>
                                <div className={`${styles.quantity_button} ${styles.quantity_down}`} onClick={() => {
                                    if (numQuestions <= 1) return;

                                    setNumQuestions((prevNumQuestions) => prevNumQuestions - 1);
                                }}>-</div>
                            </div>
                        </div>
                    <h1># of Questions</h1>
                </div>

                <button className={styles.generate_button} onClick={async () => {
                    if (prompt.length === 0) return;

                    setGenerating(true);
                    
                    let aiText = {
                        response: '',
                        success: false,
                        error: ''
                    };
                    await new Promise((resolve, reject) => {
                        generateText(`Write ${numQuestions} open ended questions that end with a question mark. They should stay between 10 and 20 words. Prompt: ${prompt}`, (state:AIState, response:string, error:string) => {
                            if (state === AIState.COMPLETED) {
                                aiText = {
                                    response: response,
                                    success: true,
                                    error: ''
                                };
                                resolve(null);
                            } else if (state === AIState.ERROR) {
                                aiText = {
                                    response: '',
                                    success: false,
                                    error: error
                                };
                                reject(error);
                            }
                        });
                    });

                    if (!aiText.success) {
                        setErrorOpen(true);
                        return;
                    }

                    const questions:string[] = parseWorksheet(aiText.response, numQuestions);
                    const functions = getFunctions();
                    const generateWorksheet = httpsCallable(functions, 'generatePdf');
                    const result:HttpsCallableResult = await generateWorksheet({
                        title: title,
                        questions: questions
                    });

                    const data:any = result.data;
                    if (!data) {
                        setErrorOpen(true);
                        return;
                    }

                    setPrompt('');
                    setTitle('');

                    window.open(data.fileUrl, '_blank');
                    setGenerating(false);
                }}>Generate</button>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={50} height={50} />
                <h1>Error generating worksheet</h1>
            </Popup>
        </div>
    );
}