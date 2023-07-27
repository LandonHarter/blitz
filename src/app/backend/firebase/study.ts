import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./init";

export enum StudyMethod {

    Flashcard = 'flashcard',
    MinuteMania = 'minutemania',
    Blurting = 'blurting',

}

export const getStudyData = async (setId: string, currentUserId: string, cache: boolean = true) => {
    const studyDataRef = doc(collection(firestore, `users/${currentUserId}/study`), setId);
    const studyDataDoc = await getDoc(studyDataRef);
    if (!studyDataDoc.exists()) {
        return null;
    }
    return studyDataDoc.data();
};

export const updateStudyData = async (setId: string, method: StudyMethod, currentUserId: string, data: any) => {
    const studyDataRef = doc(collection(firestore, `users/${currentUserId}/study`), setId);
    const studyData = await getStudyData(setId, currentUserId, true);

    if (!studyData) {
        await setDoc(studyDataRef, {
            [method]: data,
        });
        return;
    }

    await updateDoc(studyDataRef, {
        [method]: data,
    });
};