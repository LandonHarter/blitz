import styles from './page.module.css';

import Image from 'next/image';

export default function Home() {
  return (
    <div>
        <div className={styles.hero_section_1}>
            <div className={styles.hero_section_1_left}>
                <h1>Learning shouldn&apos;t <span>cost</span></h1>
            </div>
            <div className={styles.hero_section_1_right}>
                <Image src='/images/icons/classroom.png' alt='classroom' width={400} height={400} />
            </div>
        </div>
    </div>
  );
}
