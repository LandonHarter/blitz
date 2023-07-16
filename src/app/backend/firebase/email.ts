import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "./init";

// VIA: Brevo and Firebase Email Trigger

export const sendEmail = async (to: string, subject: string, body: string) => {
    const emailRef = doc(collection(firestore, 'email'));
    await setDoc(emailRef, {
        to: [to],
        message: {
            subject: subject,
            text: body,
        },
    });
};

export const sendEmailFromTemplate = async (to: string, subject: string, template: string) => {
    const emailRef = doc(collection(firestore, 'email'));
    await setDoc(emailRef, {
        to: [to],
        message: {
            subject: subject,
            html: template,
        }
    });
};