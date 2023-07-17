'use client'

import { useState, useEffect } from "react";
import styles from './application.module.css';
import Loading from "@/components/loading/loading";
import { collection, doc, limit, query, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";
import Link from "next/link";
import { sendEmailFromTemplate } from "@/backend/firebase/email";
import { AcceptedTeacherTemplate, RejectedTeacherTemplate } from "@/backend/firebase/emailTemplates";

export default function TeacherApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const ApplicationCard = (application: any) => {
        return (
            <div className={styles.application}>
                <h1>{application.name}</h1>
                <Link href={application.image} target="_blank">Open Proof</Link>

                <div className={styles.bottom_bar}>
                    <button className={styles.accept_button} onClick={() => {
                        acceptApplication(application);
                    }}>Accept</button>
                    <button className={styles.reject_button} onClick={() => {
                        rejectApplication(application);
                    }}>Reject</button>
                </div>
            </div>
        );
    };

    const acceptApplication = async (application: any) => {
        const newApplications = applications.filter((app) => {
            return app.id !== application.id;
        });
        setApplications(newApplications);

        const appId = application.id;
        await deleteDoc(doc(collection(firestore, 'applications/teacher/requests'), appId));
        const userRef = doc(collection(firestore, 'users'), application.uid);
        await updateDoc(userRef, {
            verified: true,
        });

        await sendEmailFromTemplate(application.email, 'You have been accepted as a teacher!', AcceptedTeacherTemplate(application.name, application.uid));
    };

    const rejectApplication = async (application: any) => {
        const newApplications = applications.filter((app) => {
            return app.id !== application.id;
        });
        setApplications(newApplications);

        const appId = application.id;
        await deleteDoc(doc(collection(firestore, 'applications/teacher/requests'), appId));
        await sendEmailFromTemplate(application.email, 'Your teacher application has been rejected.', RejectedTeacherTemplate(application.name));
    };

    useEffect(() => {
        if (applications.length > 0) return;
        (async () => {
            const applicationsRef = collection(firestore, 'applications/teacher/requests');
            const applicationsQuery = query(applicationsRef, limit(30));
            const applicationsSnapshot = await getDocs(applicationsQuery);

            const applicationsData: any[] = [];
            applicationsSnapshot.forEach((doc) => {
                if (doc.id === 'empty') return;
                applicationsData.push({ ...doc.data(), id: doc.id });
            });

            setApplications(applicationsData);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (<Loading />);
    }

    return (
        <div className={styles.container}>
            {applications.map((application, index) => {
                return (<div key={index}>{ApplicationCard(application)}</div>);
            })}
        </div>
    );
}