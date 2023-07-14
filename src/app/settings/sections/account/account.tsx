'use client'

import { User, UserProfile } from '@/backend/firebase/user';
import SettingsSection from '../section';
import styles from './account.module.css';
import Tooltip from '@/components/tooltip/tooltip';

export default function AccountSection(props: { user: User, userProfile: UserProfile, onUpdateSettings: () => void }) {
    return (
        <SettingsSection>
            <h1 className={styles.title}>User Data</h1>
            <div className={styles.input_section}>
                <h1 className={styles.input_section_title}>Name</h1>
                <Tooltip text='Readonly' position='top'><input type='text' className={styles.input_section_input} value={props.user.name} disabled /></Tooltip>
            </div>
            <div className={styles.input_section}>
                <h1 className={styles.input_section_title}>Email</h1>
                <Tooltip text='Readonly' position='top'><input type='text' className={styles.input_section_input} value={props.user.email} disabled /></Tooltip>
            </div>
        </SettingsSection>
    )
}