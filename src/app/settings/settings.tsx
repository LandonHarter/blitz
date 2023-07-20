'use client'

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './page.module.css';
import UserContext from '@/context/usercontext';
import Loading from '@/components/loading/loading';
import AccountSection from './sections/account/account';
import ProfileSection from './sections/profile/profile';
import { UserProfile } from '@/backend/firebase/user';
import NeedSignin from '@/components/require-signin/needsignin';
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/backend/firebase/init';

export default function SettingsContent() {
    const [selectedItem, setSelectedItem] = useState<{
        index: number;
        title: string;
    }>({
        index: 0,
        title: 'Account'
    });

    const { currentUser, signedIn, userLoading } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState<UserProfile>();

    const [showUpdated, setShowUpdated] = useState(false);

    const onUpdateSettings = () => {
        setShowUpdated(true);
        setTimeout(() => {
            setShowUpdated(false);
        }, 3000);
    };

    const uiFromSection = (title: string) => {
        if (!signedIn || !userProfile) return (<></>);

        if (title === 'Account') {
            return (<AccountSection user={currentUser} userProfile={userProfile} onUpdateSettings={onUpdateSettings} />);
        } else if (title === 'Profile') {
            return (<ProfileSection user={currentUser} userProfile={userProfile} onUpdateSettings={onUpdateSettings} />);
        }

        return (<></>);
    };

    const SidebarItem = (props: { icon: string, title: string, index: number }) => (
        <motion.div className={`${styles.sidebar_item} ${props.index === selectedItem.index && styles.sidebar_item_selected}`} onClick={() => {
            setSelectedItem({
                index: props.index,
                title: props.title
            });
        }} initial={{ backgroundColor: 'transparent' }} animate={{ backgroundColor: (props.index === selectedItem.index) ? 'var(--bg-darker)' : 'transparent' }}
            transition={{ ease: 'easeIn', duration: 0.5 }}>
            <Image src={props.icon} alt='icon' width={24} height={24} className={styles.sidebar_item_image} />
            <h1 className={styles.sidebar_item_title}>{props.title}</h1>
        </motion.div>
    );

    useEffect(() => {
        if (!signedIn) return;

        (async () => {
            const userProfileRef = doc(collection(firestore, 'users-profile'), currentUser.uid);
            const userProfileData = await getDoc(userProfileRef);
            setUserProfile(userProfileData.data() as UserProfile);
        })();
    }, [signedIn]);

    if (userLoading || !userProfile) {
        return (<Loading />);
    } else if (!signedIn) {
        return (<NeedSignin />);
    }

    return (
        <div className={styles.settings_container}>
            <div className={styles.sidebar}>
                <SidebarItem icon='/images/icons/settings-solid.png' title='Account' index={0} />
                <SidebarItem icon='/images/icons/user-solid.png' title='Profile' index={1} />
            </div>
            <div className={styles.settings}>
                <h1 className={styles.settings_title}>{selectedItem.title}</h1>
                <div className={styles.settings_content}>
                    <AnimatePresence mode='wait'>
                        {uiFromSection(selectedItem.title)}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {showUpdated && <motion.div initial={{ opacity: 0, right: -400 }} animate={{ opacity: 1, right: 10 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className={styles.save_message}>
                    <Image src='/images/icons/check.png' alt='error' width={40} height={40} />
                    <h1>Successfully updated settings.</h1>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}