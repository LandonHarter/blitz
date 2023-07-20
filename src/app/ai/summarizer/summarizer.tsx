'use client'

import { useContext, useRef, useState } from 'react';

import styles from './page.module.css';
import { summarizeText } from '@/backend/ai/generate';
import { AIState } from '@/backend/ai/AIState';
import Popup from '@/components/popup/popup';
import Image from 'next/image';
import Loading from '@/components/loading/loading';
import NeedSignin from '@/components/require-signin/needsignin';
import UserContext from '@/context/usercontext';

export default function SummarizerAIContent() {
    const [article, setArticle] = useState('');
    const [summary, setSummary] = useState('');
    const [aiLoading, setAILoading] = useState(false);
    const [summarized, setSummarized] = useState(false);
    const summaryRef = useRef<HTMLHeadingElement>(null);

    const [errorOpen, setErrorOpen] = useState(false);
    const [error, setError] = useState('');

    const { currentUser, signedIn, userLoading } = useContext(UserContext);
    if (userLoading) return (<Loading />);
    if (!signedIn) return (<NeedSignin />);

    return (
        <div className={styles.page_background}>
            <h1 className={styles.title}>AI Summarizer</h1>
            <p className={styles.subtitle}>Condense any written content into only a few sentences.</p>

            <textarea className={styles.article_textarea} value={article} onChange={(e) => {
                setArticle(e.target.value);
            }} maxLength={2500} placeholder='Paste article here...' />
            <button className={`${styles.summarize_button} ${aiLoading && styles.button_loading}`} onClick={async () => {
                if (article.length < 1 || article.length > 2500) {
                    setErrorOpen(true);
                    setError('Article must be between 1 and 2500 characters.');

                    return;
                }

                setAILoading(true);
                setSummarized(true);

                await summarizeText(article, (state: AIState, response: string, error: string) => {
                    if (state === AIState.COMPLETED) {
                        setSummary(response);
                        setAILoading(false);
                        if (summaryRef && summaryRef.current) {
                            summaryRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else if (state === AIState.ERROR) {
                        setSummary(error);
                        setAILoading(false);

                        setErrorOpen(true);
                        setError(error);
                    }
                });
            }} disabled={aiLoading}>{aiLoading ? 'Processing...' : 'Summarize'}</button>

            {summarized &&
                <div className={styles.summary_container}>
                    <h1 ref={summaryRef}>Summary</h1>

                    {summary.length > 0 ? <p className={styles.summary}>{summary}</p> :
                        <div className={styles.loading_skeleton_container}>
                            <div className={styles.loading_skeleton} />
                            <div className={styles.loading_skeleton} />
                            <div className={styles.loading_skeleton} />
                            <div className={styles.loading_skeleton_last} />
                        </div>
                    }
                </div>
            }

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton >
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <p className={styles.popup_content}>{error}</p>
            </Popup>
        </div>
    );
}