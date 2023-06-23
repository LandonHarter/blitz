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

export default function CreatePage() {
    const router = useRouter();

    const [popup, setPopup] = useState(false);
    const [popupInfo, setPopupInfo] = useState('');
    const [loadingMenu, setLoadingMenu] = useState(false);
    const { currentUser, signedIn, userLoading } = useCurrentUser();

    const [nameField, setNameField] = useState('');
    const [descriptionField, setDescriptionField] = useState('');
    const [imageField, setImageField] = useState<Blob|null>(null);
    const [isPublic, setIsPublic] = useState(false);

    const createSet = async () => {
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
            public: isPublic,
            likes: 0,
            image: imageUrl,
            description: descriptionField
        });

        const userRef = doc(collection(firestore, 'users'), currentUser.uid);

        await updateDoc(userRef, {
             sets: arrayUnion(newSetId)
        });

        return newSetId;
    };

    if (loadingMenu || userLoading) {
        return(<Loading />);
    } else if (!signedIn) {
        return(<h1>Not signed in</h1>);
    }

    return(
        <div>
            <div className={styles.set_options}>
                <input type='text' placeholder='Name' className={styles.name_input} value={nameField} onChange={(e) => {
                    setNameField(e.target.value);
                }} />
                <textarea placeholder='Description' className={styles.description_input} value={descriptionField} maxLength={75} onChange={(e) => {
                    setDescriptionField(e.target.value);
                }} />

                <label htmlFor='image-input' className={styles.image_input_content}>
                    <div className={styles.image_input_button}><h1>Choose Image</h1></div>
                </label>
                <input id='image-input' type='file' className={styles.image_input} onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        setImageField(e.target.files[0]);
                    }
                }} />

                <label className={styles.mcui_checkbox}>
                    <input type="checkbox" checked={isPublic} onChange={(e) => {
                        setIsPublic(e.target.checked);
                    }} />
                    <div>
                    <svg className={styles.mcui_check} viewBox="-2 -2 35 35" aria-hidden="true">
                        <title>checkmark-circle</title>
                        <polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />
                    </svg>
                    </div>
                    <div style={{ color: 'black' }}>Public</div>
                </label>

                <button className={styles.create_button} onClick={async () => {
                    setLoadingMenu(true);
                    const setId = await createSet();
                    router.push(`/edit/${setId}`);
                }}>Create Set</button>
            </div>

            <Popup open={popup} setOpen={setPopup} exitButton >
                <p className={styles.popup_content}>{popupInfo}</p>
            </Popup>
        </div>
    );
}