import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/init";
import { AIState } from "./AIState";

const generateQuizPrompt = (prompt:string, numQuestions:number) => {
    return `Generate a quiz on the topic of ${prompt} with ${numQuestions} questions. Each question should be phrased as a question, not a statement. Each question should have 4 multiple choice options, one of which is correct. There should be no true or false questions. Questions should be separated by different lines, or the \n marker.
    For example:
    What was the name of the ship that carried George Washington across the Delaware River on Christmas night in 1776?|The Mayflower|The U.S.S. Constitution|The USS Monitor|The Dauntless|1
    \n
    What was the name of the treaty that ended the American Revolution?|The Treaty of Paris|The Treaty of Versailles|The Treaty of Utrecht|The Treaty of Rome|2`;
};

export const generateQuiz = async (prompt:string, numQuestions:number, callback:Function) => {
    const aiRef = doc(collection(firestore, 'ai-chatbot'));
    const aiPrompt = generateQuizPrompt(prompt, numQuestions);

    await setDoc(aiRef, {prompt: aiPrompt});
    const unsub = onSnapshot(aiRef, (doc) => {
        if (!doc.exists()) return;
        if (!doc.data()?.status) return;

        if (doc.data()?.status.state === 'COMPLETED') {
            callback(AIState.COMPLETED, doc.data()?.response, null);
            deleteDoc(aiRef);
            unsub();
        } else if (doc.data()?.status.state === 'PROCESSING') {
            callback(AIState.PROCESSING, null, 'Processing...');
        } else if (doc.data()?.status.state === 'ERRORED') {
            callback(AIState.ERROR, null, doc.data()?.status.error);
            deleteDoc(aiRef);
            unsub();
        }
    });
};

export const summarizeText = async (text:string, callback:Function) => {
    const aiRef = doc(collection(firestore, 'ai-summarize'));
    await setDoc(aiRef, {text: text});

    const unsub = onSnapshot(aiRef, (doc) => {
        if (!doc.exists()) return;
        if (!doc.data()?.status) return;

        if (doc.data()?.status.state === 'COMPLETED') {
            callback(AIState.COMPLETED, doc.data()?.summary, null);
            deleteDoc(aiRef);
            unsub();
        } else if (doc.data()?.status.state === 'PROCESSING') {
            callback(AIState.PROCESSING, null, 'Processing...');
        } else if (doc.data()?.status.state === 'ERRORED') {
            callback(AIState.ERROR, null, doc.data()?.status.error);
            deleteDoc(aiRef);
            unsub();
        }
    });
};

export const generateText = async (prompt:string, callback:Function) => {
    const aiRef = doc(collection(firestore, 'ai-chatbot'));

    await setDoc(aiRef, {prompt: prompt});
    const unsub = onSnapshot(aiRef, (doc) => {
        if (!doc.exists()) return;
        if (!doc.data()?.status) return;

        if (doc.data()?.status.state === 'COMPLETED') {
            callback(AIState.COMPLETED, doc.data()?.response, null);
            deleteDoc(aiRef);
            unsub();
        } else if (doc.data()?.status.state === 'PROCESSING') {
            callback(AIState.PROCESSING, null, 'Processing...');
        } else if (doc.data()?.status.state === 'ERRORED') {
            callback(AIState.ERROR, null, doc.data()?.status.error);
            deleteDoc(aiRef);
            unsub();
        }
    });
};