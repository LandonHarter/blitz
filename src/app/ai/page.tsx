'use client'

import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function AIPage() {

    const AICard = (props:{ title:string, description:string, image:string, link:string }) => {
        return(
            <Link href={props.link} className={styles.ai_card}>
                <div className={styles.ai_card_top}>
                    <Image src={props.image} width={60} height={60} alt='ai logo' />
                    <h1>{props.title}</h1>
                </div>

                <p>{props.description}</p>
            </Link>
        );
    };

    return(
        <div className={styles.page_container}>
            <h1 className={styles.title}>AI Tools</h1>
            <div className={styles.tick} />

            <div className={styles.ai_options}>
                <AICard 
                    title='Summarizer' 
                    description='Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.' 
                    image='/images/icons/ai/book.png'
                    link='/ai/summarizer'
                />
            </div>
        </div>
    );
}