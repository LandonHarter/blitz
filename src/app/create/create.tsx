'use client'

import { useContext, useState } from 'react';
import styles from './page.module.css';
import Popup from '@/components/popup/popup';
import Loading from '@/components/loading/loading';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc, Timestamp, increment } from 'firebase/firestore';
import { firestore, storage } from '@baas/init';
import { useRouter } from 'next/navigation';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import FileResizer from 'react-image-file-resizer';
import Image from 'next/image';
import TabBar from '@/components/tabs/tabbar';
import Tab from '@/components/tabs/tab';
import { generateQuiz } from '@/backend/ai/generate';
import { AIState } from '@/backend/ai/AIState';
import AILoading from '@/components/ai-loading/loading';
import { parseAi } from '@/backend/ai/convert';
import NeedSignin from '@/components/require-signin/needsignin';
import UserContext from '@/context/usercontext';

export default function CreateContent() {
    const router = useRouter();

    const [errorPopup, setErrorPopup] = useState(false);
    const [error, setError] = useState('');

    const [aiPopup, setAiPopup] = useState(false);

    const [loadingMenu, setLoadingMenu] = useState(false);
    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [nameField, setNameField] = useState('');
    const [descriptionField, setDescriptionField] = useState('');
    const [imageField, setImageField] = useState<Blob | null>(null);
    const [imagePath, setImagePath] = useState<string | null>('/images/missingimage.jpg');

    const [aiPrompt, setAiPrompt] = useState('');
    const [articlePrompt, setArticlePrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiNumQuestions, setAiNumQuestions] = useState(5);

    const [selectedAiTab, setSelectedAiTab] = useState(0);

    const createSet = async () => {
        if (nameField.length < 1 || descriptionField.length < 1) {
            setError('Please fill out all fields');
            setErrorPopup(true);
            setLoadingMenu(false);
            return {
                success: false,
                id: ''
            };
        }

        if (nameField.length > 24 || descriptionField.length > 75) {
            setError('Please shorten your name or description');
            setErrorPopup(true);
            setLoadingMenu(false);
            return {
                success: false,
                id: ''
            };
        }

        const newSetRef = doc(collection(firestore, 'sets'));
        const newSetId = newSetRef.id;

        let imageUrl = '/images/missingimage.jpg';
        if (imageField) {
            const imageUri = await new Promise<string>((resolve) => {
                FileResizer.imageFileResizer(imageField, 500, 500, 'JPEG', 100, 0, (uri) => {
                    // @ts-ignore
                    resolve(uri);
                });
            });

            const imageRef = ref(storage, `set-images/${newSetId}`);
            await uploadString(imageRef, imageUri, 'data_url');
            imageUrl = await getDownloadURL(imageRef);
        }

        await setDoc(newSetRef, {
            id: newSetId,
            name: nameField,
            questions: [],
            numQuestions: 0,
            settings: {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            owner: currentUser.uid,
            ownerName: currentUser.name,
            public: true,
            likes: 0,
            image: imageUrl,
            description: descriptionField
        });

        const userRef = doc(collection(firestore, 'users'), currentUser.uid);
        await updateDoc(userRef, {
            sets: arrayUnion({
                id: newSetId,
                name: nameField,
                description: descriptionField,
                image: imageUrl,
                updatedAt: Timestamp.now()
            })
        });

        await updateDoc(doc(collection(firestore, 'site'), 'metrics'), {
            numSets: increment(1)
        });

        return {
            success: true,
            id: newSetId
        };
    };

    const createSetAiPrompt = async () => {
        if (aiPrompt.length < 1 || aiPrompt.length > 50) {
            setError('Prompt must be between 1 and 50 characters');
            setErrorPopup(true);
            setAiPopup(false);
            return;
        }

        setAiLoading(true);
        generateQuiz(aiPrompt, aiNumQuestions, async (state: AIState, response: string, error: string | null) => {
            if (state === AIState.ERROR) {
                setError(error || 'An unknown error occurred');
                setErrorPopup(true);
                setAiPopup(false);
                setAiLoading(false);
                return;
            } else if (state === AIState.COMPLETED) {
                const {
                    success,
                    error,
                    questions
                } = parseAi(response, 5);

                if (!success || error || !questions) {
                    setError(error || 'An unknown error occurred');
                    setErrorPopup(true);
                    setAiPopup(false);
                    setAiLoading(false);
                    return;
                }

                setAiPrompt('');
                setAiNumQuestions(5);

                const newSetRef = doc(collection(firestore, 'sets'));
                const newSetId = newSetRef.id;

                await setDoc(newSetRef, {
                    id: newSetId,
                    name: aiPrompt,
                    questions: questions,
                    numQuestions: questions.length,
                    settings: {},
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    owner: currentUser.uid,
                    public: false,
                    likes: 0,
                    image: '/images/missingimage.jpg',
                    description: `${aiPrompt} set generated by AI`,
                    scramble: false
                });

                const userRef = doc(collection(firestore, 'users'), currentUser.uid);
                await updateDoc(userRef, {
                    sets: arrayUnion({
                        id: newSetId,
                        name: aiPrompt,
                        description: `${aiPrompt} set generated by AI`,
                        image: '/images/missingimage.jpg',
                        updatedAt: Timestamp.now()
                    })
                });

                router.push(`/edit/${newSetId}`);
            }
        });
    }

    if (loadingMenu || userLoading) {
        return (<Loading />);
    } else if (!signedIn) {
        return (<NeedSignin />);
    } else if (aiLoading) {
        return (<AILoading />);
    }

    return (
        <div>
            <div className={styles.create_form}>
                <h1 className={styles.form_title}>Create New Set</h1>
                <div className={styles.form_tick} />

                <div className={styles.form_content}>
                    <div className={styles.form_inputs}>
                        <div className={styles.name_input}>
                            <input type="text" id="name-input" className={styles.name_input_field} placeholder="Set name" value={nameField} onChange={(e) => {
                                setNameField(e.target.value);
                            }} maxLength={24} />
                            <label htmlFor="name-input" className={styles.name_input_label}>Name</label>
                        </div>
                        <div className={styles.description_input}>
                            <textarea id="description-input" className={styles.description_input_field} placeholder="Set description" value={descriptionField} onChange={(e) => {
                                setDescriptionField(e.target.value);
                            }} style={{ resize: 'none' }} maxLength={75} />
                            <label htmlFor="description-input" className={styles.description_input_label}>Description</label>
                        </div>
                    </div>
                    <div className={styles.form_picture}>
                        <div className={styles.file_input_wrapper} style={{ backgroundImage: `url("${imagePath}")` }}>
                            <input id='file-input' type="file" className={styles.picture_input_field} accept=".png,.jpg,.jpeg" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageField(e.target.files[0]);
                                    setImagePath(URL.createObjectURL(e.target.files[0]));
                                }
                            }} />
                            <label htmlFor='file-input' className={styles.picture_overlay}>
                                <p>Choose Image</p>
                            </label>
                        </div>
                    </div>
                </div>

                <button className={styles.create_button} onClick={async () => {
                    setLoadingMenu(true);
                    const {
                        success,
                        id: newSetId
                    } = await createSet();

                    if (success) {
                        router.push(`/edit/${newSetId}`);
                    }
                }}>Create Set</button>

                <div className={styles.or_container}>
                    <div className={styles.small_divider} />
                    <p>or</p>
                    <div className={styles.small_divider} />
                </div>

                <button className={`${styles.provider_button} ${styles.quizlet_button}`} onClick={() => {
                    setError('Quizlet import is not yet supported');
                    setErrorPopup(true);
                }}>
                    <Image src='/images/providers/quizlet.png' alt='quizlet' width={32} height={32} />
                    Import from Quizlet
                </button>
                <button className={`${styles.provider_button} ${styles.kahoot_button}`} onClick={() => {
                    setError('Kahoot import is not yet supported');
                    setErrorPopup(true);
                }}>
                    <Image src='/images/providers/kahoot.png' alt='kahoot' width={35} height={35} />
                    Import from Kahoot
                </button>
                <button className={`${styles.provider_button} ${styles.ai_button}`} onClick={() => {
                    setAiPopup(true);
                }}>
                    <Image src='/images/icons/robot.png' alt='robot' width={45} height={45} />
                    Create from AI
                </button>
            </div>

            <Popup open={errorPopup} setOpen={setErrorPopup} exitButton >
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <p className={styles.popup_content}>{error}</p>
            </Popup>

            <Popup open={aiPopup} setOpen={setAiPopup} exitButton>
                <Image src='/images/icons/robot-dark.png' alt='robot' width={60} height={60} style={{ marginBottom: 25 }} />

                <h1 style={{ color: "#353535", marginBottom: 15 }}>Generate from...</h1>
                <div className={styles.ai_popup_content}>
                    <TabBar setSelectedTab={setSelectedAiTab}>
                        <Tab title='Topic'>
                            <div className={styles.question_num}>
                                <div className={styles.quantity}>
                                    <input className={styles.number_input} type="number" min={1} max={10} step={1} value={aiNumQuestions} />
                                    <div className={styles.quantity_nav}>
                                        <div className={`${styles.quantity_button} ${styles.quantity_up}`} onClick={() => {
                                            if (aiNumQuestions >= 10) return;

                                            setAiNumQuestions((prevNumQuestions) => prevNumQuestions + 1);
                                        }}>+</div>
                                        <div className={`${styles.quantity_button} ${styles.quantity_down}`} onClick={() => {
                                            if (aiNumQuestions <= 1) return;

                                            setAiNumQuestions((prevNumQuestions) => prevNumQuestions - 1);
                                        }}>-</div>
                                    </div>
                                </div>
                                <h1># of Questions</h1>
                            </div>
                            <textarea className={styles.ai_prompt_field} placeholder='Set prompt' maxLength={50} value={aiPrompt} onChange={(e) => {
                                setAiPrompt(e.target.value);
                            }} />
                        </Tab>
                        <Tab title='Article'>
                            <div className={styles.question_num}>
                                <div className={styles.quantity}>
                                    <input className={styles.number_input} type="number" min={1} max={10} step={1} value={aiNumQuestions} />
                                    <div className={styles.quantity_nav}>
                                        <div className={`${styles.quantity_button} ${styles.quantity_up}`} onClick={() => {
                                            if (aiNumQuestions >= 10) return;

                                            setAiNumQuestions((prevNumQuestions) => prevNumQuestions + 1);
                                        }}>+</div>
                                        <div className={`${styles.quantity_button} ${styles.quantity_down}`} onClick={() => {
                                            if (aiNumQuestions <= 1) return;

                                            setAiNumQuestions((prevNumQuestions) => prevNumQuestions - 1);
                                        }}>-</div>
                                    </div>
                                </div>
                                <h1># of Questions</h1>
                            </div>
                            <textarea className={styles.ai_prompt_field} placeholder='Paste article here' maxLength={2500} value={articlePrompt} onChange={(e) => {
                                setArticlePrompt(e.target.value);
                            }} />
                        </Tab>
                    </TabBar>

                    <button className={styles.ai_generate_button} onClick={() => {
                        if (aiNumQuestions > 10 || aiNumQuestions < 1) {
                            setError('Number of questions must be between 1 and 10');
                            setErrorPopup(true);
                            setAiPopup(false);
                            return;
                        }

                        if (selectedAiTab === 0) {
                            if (aiPrompt.length < 1 || aiPrompt.length > 50) {
                                setError('Prompt must be between 1 and 50 characters');
                                setErrorPopup(true);
                                setAiPopup(false);
                                return;
                            }

                            createSetAiPrompt();
                        } else {
                            setError('Article generation is not yet supported');
                            setErrorPopup(true);
                            setAiPopup(false);
                        }
                    }}>Generate</button>
                </div>
            </Popup>
        </div>
    );
}