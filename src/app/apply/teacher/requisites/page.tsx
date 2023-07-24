import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Teacher Application Requisites • Blitz',
    description: 'Apply to become a Blitz teacher.',
    other: {
        'og:image': 'https://blitzedu.vercel.app/icon.png',
        'og:title': 'Teacher Application Requisites • Blitz',
        'og:description': 'Apply to become a Blitz teacher.',
        'twitter:image': 'https://blitzedu.vercel.app/icon.png',
        'twitter:title': 'Teacher Application Requisites • Blitz',
        'twitter:description': 'Apply to become a Blitz teacher.',
        'twitter:card': 'summary_large_image',
    }
};

export default function ApplyTeacherRequisitesPage() {
    return (
        <div className={styles.requisites_container}>
            <h1 className={styles.title}>Teacher Application Requisites</h1>
            <h3 className={styles.subtitle}>Effective Date: 7/17/2023</h3>
            <div className={styles.divider} />
            <div className={styles.requisites}>
                <p>
                    1. School Issued Email
                    <p className={styles.section_content}>
                        <p className={styles.section_content}>
                            1.1 Teacher verification requires the account to use a school issued email address.
                        </p>
                    </p>
                </p>
                <p>
                    2. Employment
                    <p className={styles.section_content}>
                        <p className={styles.section_content}>
                            2.1 You must be actively employed by a school or educational institution.
                        </p>
                        <p className={styles.section_content}>
                            2.2 Accepted forms of employment include but are not limited to: Teacher, Professor, Instructor, Tutor.
                        </p>
                    </p>
                </p>
            </div>
        </div>
    )
};