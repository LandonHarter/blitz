'use client'

import { Question } from "@/backend/live/set";
import { Dispatch, SetStateAction, useState } from "react";
import styles from './questionimage.module.css';
import FileResizer from "react-image-file-resizer";
import { storage } from "@/backend/firebase/init";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function QuestionImage(props: { question: Question, setQuestions: Dispatch<SetStateAction<any>> }) {
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    return (
        <div>
            <input type="file" id={`question-photo-input-${props.question.id}`} style={{ display: 'none' }} onChange={async (e) => {
                if (!e.target.files || !e.target.files[0]) return;

                setImageLoading(true);
                const imageField: Blob = e.target.files[0];
                const imageUri = await new Promise<string>((resolve) => {
                    FileResizer.imageFileResizer(imageField, 500, 500, 'JPEG', 100, 0, (uri) => {
                        // @ts-ignore
                        resolve(uri);
                    });
                });
                const imageRef = ref(storage, `questions/${props.question.id}`);
                await uploadString(imageRef, imageUri, 'data_url');
                const imageUrl = await getDownloadURL(imageRef);
                props.question.photo = imageUrl;
                props.setQuestions((oldQuestions: any) => [...oldQuestions]);
                setImageLoading(false);
            }} />
            <label htmlFor={`question-photo-input-${props.question.id}`}>
                {!imageLoading ?
                    <div className={styles.image} style={{ backgroundImage: `url('${props.question.photo || '/images/missingimage.jpg'}')` }} /> :
                    <div className={styles.image_loading}>
                        <svg className={styles.pencil} viewBox="0 0 200 200" width="200px" height="200px" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <clipPath id="pencil-eraser">
                                    <rect rx="5" ry="5" width="30" height="30"></rect>
                                </clipPath>
                            </defs>
                            <circle className={styles.pencil__stroke} r="70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="439.82 439.82" strokeDashoffset="439.82" strokeLinecap="round" transform="rotate(-113,100,100)" />
                            <g className={styles.pencil__rotate} transform="translate(100,100)">
                                <g fill="none">
                                    <circle className={styles.pencil__body1} r="64" stroke="hsl(223,90%,50%)" strokeWidth="30" strokeDasharray="402.12 402.12" strokeDashoffset="402" transform="rotate(-90)" />
                                    <circle className={styles.pencil__body2} r="74" stroke="hsl(223,90%,60%)" strokeWidth="10" strokeDasharray="464.96 464.96" strokeDashoffset="465" transform="rotate(-90)" />
                                    <circle className={styles.pencil__body3} r="54" stroke="hsl(223,90%,40%)" strokeWidth="10" strokeDasharray="339.29 339.29" strokeDashoffset="339" transform="rotate(-90)" />
                                </g>
                                <g className={styles.pencil__eraser} transform="rotate(-90) translate(49,0)">
                                    <g className={styles.pencil__eraser_skew}>
                                        <rect fill="hsl(223,90%,70%)" rx="5" ry="5" width="30" height="30" />
                                        <rect fill="hsl(223,90%,60%)" width="5" height="30" clip-path="url(#pencil-eraser)" />
                                        <rect fill="hsl(223,10%,90%)" width="30" height="20" />
                                        <rect fill="hsl(223,10%,70%)" width="15" height="20" />
                                        <rect fill="hsl(223,10%,80%)" width="5" height="20" />
                                        <rect fill="hsla(223,10%,10%,0.2)" y="6" width="30" height="2" />
                                        <rect fill="hsla(223,10%,10%,0.2)" y="13" width="30" height="2" />
                                    </g>
                                </g>
                                <g className={styles.pencil__point} transform="rotate(-90) translate(49,-30)">
                                    <polygon fill="hsl(33,90%,70%)" points="15 0,30 30,0 30" />
                                    <polygon fill="hsl(33,90%,50%)" points="15 0,6 30,0 30" />
                                    <polygon fill="hsl(223,10%,10%)" points="15 0,20 10,10 10" />
                                </g>
                            </g>
                        </svg>
                    </div>
                }
            </label>
        </div>
    );
}