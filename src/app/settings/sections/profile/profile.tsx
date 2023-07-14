'use client'

import { User, UserProfile } from '@/backend/firebase/user';
import SettingsSection from '../section';
import { useState } from 'react';
import styles from './profile.module.css';
import sectionStyles from '../section.module.css';
import { profileBackgroundColors } from '@/backend/color';
import Image from 'next/image';
import { firestore } from '@/backend/firebase/init';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProfileSection(props: { user: User, userProfile: UserProfile, onUpdateSettings: () => void }) {
    const [selectedBackground, setSelectedBackground] = useState<string>(props.userProfile.profileBackground);

    const formatGradientName = (name: string) => {
        let formattedName = name.replace(/-/g, ' ');
        formattedName = formattedName.replace(/\b\w/g, l => l.toUpperCase());
        return formattedName;
    };

    const saveSettings = async () => {
        const userProfileRef = doc(collection(firestore, 'users-profile'), props.user.uid);
        await updateDoc(userProfileRef, {
            profileBackground: selectedBackground
        });
        props.onUpdateSettings();
    };

    return (
        <SettingsSection>
            <div className={styles.profile_background_section}>
                <h1 className={styles.profile_background_title}>Profile Background</h1>
                <div className={styles.profile_background_colors}>
                    <AnimatePresence mode='wait'>
                        {profileBackgroundColors.map((color, index) => (
                            <div key={index} className={styles.profile_background_color_container}>
                                <div className={`${styles.profile_background_color} ${selectedBackground === color.name && styles.profile_background_color_selected}`} style={{ background: color.value }} onClick={() => {
                                    setSelectedBackground(color.name);
                                }}>
                                    {selectedBackground === color.name &&
                                        <motion.div className={styles.profile_background_color_selected_icon} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                            <Image src='/images/icons/check-solid.png' alt='check' width={20} height={20} />
                                        </motion.div>
                                    }
                                </div>
                                <h1 className={styles.profile_background_color_name}>{formatGradientName(color.name)}</h1>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <button className={sectionStyles.save_button} onClick={() => {
                saveSettings();
            }}>Save</button>
        </SettingsSection>
    )
}