'use client'

import { useContext, useState } from 'react';
import styles from './page.module.css';
import UserContext from '@/context/usercontext';
import BasicReturn from '@/components/basic-return/return';
import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';
import Link from 'next/link';
import Loading from '@/components/loading/loading';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '@/backend/firebase/init';
import FileResizer from 'react-image-file-resizer';
import generateId from '@/backend/id';

export default function ApplyTeacherPage() {
    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [imagePath, setImagePath] = useState('/images/missingimage.jpg');
    const [file, setFile] = useState<Blob | null>(null);
    const [selectedContentType, setSelectedContentType] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [submittedApplication, setSubmittedApplication] = useState(false);

    const submitApplication = async () => {
        if (loading || !file) return;

        setLoading(true);

        let imageUrl = '/images/missingimage.jpg';
        const imageUri = await new Promise<string>((resolve) => {
            FileResizer.imageFileResizer(file, 500, 500, 'JPEG', 100, 0, (uri: any) => {
                // @ts-ignore
                resolve(uri);
            });
        });

        const imageRef = ref(storage, `applications/teacher/${generateId()}`);
        await uploadString(imageRef, imageUri, 'data_url');
        imageUrl = await getDownloadURL(imageRef);

        const applicationRef = doc(collection(firestore, 'applications/teacher/requests'));
        const application = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.name,
            contentType: getContentTypeFromIndex(selectedContentType),
            image: imageUrl,
        };

        await setDoc(applicationRef, application);
        setLoading(false);
        setSubmittedApplication(true);
    };

    const contentType = (props: { title: string, index: number }) => {
        return (
            <div className={styles.select_box__value}>
                <input className={styles.select_box__input} type="radio" id={`${props.index}`} checked={selectedContentType === props.index} />
                <p className={styles.select_box__input_text}>{props.title}</p>
            </div>
        );
    };

    const contentDisplay = (props: { title: string, index: number }) => {
        return (
            <li onClick={() => {
                setSelectedContentType(props.index);
            }}>
                <label className={styles.select_box__option} htmlFor={`${props.index}`}>{props.title}</label>
            </li>
        );
    };

    const getContentTypeFromIndex = (index: number) => {
        switch (index) {
            case 0:
                return 'teacher-portal';
            case 1:
                return 'teacher-badge';
            case 2:
                return 'teaching-certificate';
            case 3:
                return 'other';
            default:
                return 'other';
        }
    };

    if (loading || userLoading) {
        return (<Loading />);
    }

    if (currentUser.verified) {
        return (<BasicReturn text='You are already verified.' returnLink='/' />)
    }

    if (submittedApplication) {
        return (<BasicReturn text='Your application has been submitted. We will get back to you soon.' returnLink='/' />)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Apply for Teacher</h1>
            <p className={styles.subtitle}>Read the <Link href='/apply/teacher/requisites'>requisites</Link></p>
            <div className={styles.photo_proof_container}>
                <h1 className={styles.photo_proof_title}>Photo Proof</h1>
                <div className={styles.select_box}>
                    <div className={styles.select_box__current} tabIndex={1}>
                        {contentType({ title: 'Teacher Portal', index: 0 })}
                        {contentType({ title: 'Teacher Badge/ID', index: 1 })}
                        {contentType({ title: 'Teaching Certificate', index: 2 })}
                        {contentType({ title: 'Other', index: 3 })}
                        <img className={styles.select_box__icon} src="http://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true" />
                    </div>
                    <ul className={styles.select_box__list}>
                        {contentDisplay({ title: 'Teacher Portal', index: 0 })}
                        {contentDisplay({ title: 'Teacher Badge/ID', index: 1 })}
                        {contentDisplay({ title: 'Teaching Certificate', index: 2 })}
                        {contentDisplay({ title: 'Other', index: 3 })}
                    </ul>
                </div>
                <div className={styles.form_picture}>
                    <div className={styles.file_input_wrapper} style={{ backgroundImage: `url("${imagePath}")` }}>
                        <input id='file-input' type="file" className={styles.picture_input_field} accept=".png,.jpg,.jpeg" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImagePath(URL.createObjectURL(e.target.files[0]));
                                setFile(e.target.files[0]);
                            }
                        }} />
                        <label htmlFor='file-input' className={styles.picture_overlay}>
                            <p>Choose Image</p>
                        </label>
                    </div>
                </div>
            </div>

            <button className={styles.submit_button} onClick={() => {
                submitApplication();
            }}>Submit</button>
        </div>
    );
}