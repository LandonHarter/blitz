'use client'

import styles from './page.module.css';

import { useRouter, usePathname } from 'next/navigation';

export default function QuizPage() {
    const id = usePathname().split('/')[2];
    const router = useRouter();

    return(
        <div>

        </div>
    );
}