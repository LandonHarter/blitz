'use client'

import Link from 'next/link';
import styles from './404.module.css';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.small_title}>404</h1>
      <h1 className={styles.big_title}>We couldn&apos;t find this page 🤷</h1>
      <h1 className={styles.subtitle}>We looked everywhere and couldn&apos;t find this page. Try another place.</h1>
      <div className={styles.buttons}>
        <button className={styles.go_back} onClick={() => {
          router.back();
        }}>← Go Back</button>
        <Link href='/'><button className={styles.go_home}>Go Home</button></Link>
      </div>
    </div>
  )
}