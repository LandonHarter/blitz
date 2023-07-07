'use client'

import Link from 'next/link';
import styles from './notingame.module.css';
import BasicReturn from '@/components/basic-return/return';

export default function NotInGame() {
    return(
        <BasicReturn text='Oops! You are not in this game.' returnLink='/join' />
    );
}