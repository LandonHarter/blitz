'use client'

import { Roles, hasRole } from "@/backend/firebase/roles";
import BasicReturn from "@/components/basic-return/return";
import Loading from "@/components/loading/loading";
import UserContext from "@/context/usercontext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AdminPage() {
    const router = useRouter();
    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [loadingAccess, setLoadingAccess] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

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
            <h1>Admin Page</h1>
        </div>
    );
}