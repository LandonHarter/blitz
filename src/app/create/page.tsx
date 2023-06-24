'use client'

import { useState } from 'react';
import styles from './page.module.css';
import Popup from '@/components/popup/popup';
import Loading from '@/components/loading/loading';
import { arrayUnion, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@baas/init';
import { useRouter } from 'next/navigation';
import useCurrentUser from '@hooks/useCurrentUser';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import FileResizer from 'react-image-file-resizer';
import Image from 'next/image';

export default function CreatePage() {
    const router = useRouter();

    const [popup, setPopup] = useState(false);
    const [popupInfo, setPopupInfo] = useState('');
    const [loadingMenu, setLoadingMenu] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [nameField, setNameField] = useState('');
    const [descriptionField, setDescriptionField] = useState('');
    const [imageField, setImageField] = useState<Blob|null>(null);
    const [imagePath, setImagePath] = useState<string|null>('/images/missingimage.jpg');

    const createSet = async () => {
        if (nameField.length < 1 || descriptionField.length < 1) {
            setPopupInfo('Please fill out all fields');
            setPopup(true);
            setLoadingMenu(false);
            return {
                success: false,
                id: ''
            };
        }

        if (nameField.length > 24 || descriptionField.length > 75) {
            setPopupInfo('Please shorten your name or description');
            setPopup(true);
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
            public: false,
            likes: 0,
            image: imageUrl,
            description: descriptionField
        });

        const userRef = doc(collection(firestore, 'users'), currentUser.uid);

        await updateDoc(userRef, {
             sets: arrayUnion(newSetId)
        });

        return {
            success: true,
            id: newSetId
        };
    };

    if (loadingMenu || userLoading) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>Not signed in</h1>);
    }

    return(
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
                        <label htmlFor='set-thumbnail'>
                            <img src={imagePath || '/images/missingimage.jpg'} alt='avatar' />
                        </label>
                        <input type='file' id='set-thumbnail' accept='image/*' style={{ display: 'none' }} onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageField(e.target.files[0]);
                                setImagePath(URL.createObjectURL(e.target.files[0]));
                            }
                        }} />
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

                <button className={`${styles.provider_button} ${styles.quizlet_button}`}>
                    <Image src='/images/providers/quizlet.png' alt='quizlet' width={60} height={60} />
                    Import from Quizlet
                </button>
                <button className={`${styles.provider_button} ${styles.kahoot_button}`}>
                    <Image src='/images/providers/kahoot.png' alt='kahoot' width={35} height={35} />
                    Import from Kahoot
                </button>
                <button className={`${styles.provider_button} ${styles.ai_button}`}>
                    <Image src='/images/icons/robot.png' alt='robot' width={40} height={40} />
                    Create from AI
                </button>
            </div>

            <Popup open={popup} setOpen={setPopup} exitButton >
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom:25 }} />
                <p className={styles.popup_content}>{popupInfo}</p>
            </Popup>
        </div>
    );
}