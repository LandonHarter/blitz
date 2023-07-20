'use client'

import Footer from '@/components/footer/footer';
import styles from './page.module.css';
import Image from 'next/image';

export default function WhyUsPage() {
    return (
        <div className={styles.page_container}>
            <div className='bg_scrolling' />

            <div className={styles.hero}>
                <h1 className={styles.small_title}>Why Us?</h1>
                <h1 className={styles.big_title}>What makes us different?</h1>
                <h1 className={styles.subtitle}>Blitz offers a plethera of <span className={styles.gradient_word}>FREE</span> services that improve your studying experience.</h1>
            </div>

            <div className={styles.features}>
                <div className={styles.feature}>
                    <div className={styles.feature_image}>
                        <div className={styles.image_ring_1} />
                        <div className={styles.image_ring_2} />
                        <Image className={styles.feature_image_content} src='/images/icons/robotprimary.png' alt='' width={50} height={50} />
                    </div>
                    <h1 className={styles.feature_title}>AI Powered</h1>
                    <p className={styles.feature_description}>Uses AI generative language models to generate content and analyze text.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.feature_image}>
                        <div className={styles.image_ring_1} />
                        <div className={styles.image_ring_2} />
                        <Image className={styles.feature_image_content} src='/images/icons/moneyprimary.png' alt='' width={40} height={40} />
                    </div>
                    <h1 className={styles.feature_title}>Pricing</h1>
                    <p className={styles.feature_description}>Use all Blitz services completely free of charge, forever.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.feature_image}>
                        <div className={styles.image_ring_1} />
                        <div className={styles.image_ring_2} />
                        <Image className={styles.feature_image_content} src='/images/icons/increaseprimary.png' alt='' width={40} height={40} />
                    </div>
                    <h1 className={styles.feature_title}>Growing Platform</h1>
                    <p className={styles.feature_description}>Blitz&apos;s features and resources are growing by the day, making sure you never run out of content.</p>
                </div>
            </div>

            <div style={{ marginBottom: 100 }} />

            <Footer />
        </div>
    );
}