'use client'

import { Roles, hasRole } from "@/backend/firebase/roles";
import BasicReturn from "@/components/basic-return/return";
import Loading from "@/components/loading/loading";
import UserContext from "@/context/usercontext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import TeacherApplications from "./application/teacher";
import styles from './page.module.css';

export default function AdminPage() {
    const router = useRouter();
    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [loadingAccess, setLoadingAccess] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    const [currentPage, setCurrentPage] = useState('home');

    const getCurrentUI = () => {
        if (currentPage === 'home') {
            return (<h1>Admin</h1>);
        } else if (currentPage === 'applications/teacher') {
            return (<TeacherApplications />);
        }

        return (<></>);
    }

    const isPageSelected = (page: string) => {
        return `${currentPage === page && styles.page_selected}`;
    }

    useEffect(() => {
        if (!signedIn) {
            return;
        }

        (async () => {
            const isAdmin = await hasRole(currentUser.uid, Roles.ADMIN);
            if (!isAdmin) {
                router.push('/');
                return;
            }

            setHasAccess(true);
            setLoadingAccess(false);
        })();
    }, [currentUser]);

    if (userLoading || loadingAccess) {
        return (<Loading />);
    }

    if (!hasAccess) {
        return (
            <BasicReturn text="Access denied" returnLink="/" />
        );
    }



    return (
        <div>
            <div className={styles.all_buttons}>
                <button className={isPageSelected('home')} onClick={() => setCurrentPage('home')}>Home</button>
                <button className={isPageSelected('applications/teacher')} onClick={() => setCurrentPage('applications/teacher')}>Teacher Applications</button>
            </div>
            {getCurrentUI()}
        </div>
    );
}