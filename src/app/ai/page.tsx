import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { Metadata } from 'next';
import Footer from '@/components/footer/footer';

export const metadata: Metadata = {
    title: "AI Tools • Blitz",
    description: "A collection of AI tools to boost study productivity, in and out of the classroom.",
    other: {
        "og:image": "https://blitzedu.vercel.app/icon.png",
        "og:title": "AI Tools • Blitz",
        "og:description": "A collection of AI tools to boost study productivity, in and out of the classroom.",
        "twitter:image": "https://blitzedu.vercel.app/icon.png",
        "twitter:title": "AI Tools • Blitz",
        "twitter:description": "A collection of AI tools to boost study productivity, in and out of the classroom.",
        "twitter:card": "app",
    }
};

export default function AIPage() {
    const AICard = (props: { title: string, description: string, image: string, link: string }) => {
        return (
            <Link href={props.link} className={styles.ai_card}>
                <div className={styles.ai_card_top}>
                    <Image src={props.image} width={60} height={60} alt='ai logo' />
                    <h1>{props.title}</h1>
                </div>

                <p>{props.description}</p>
            </Link>
        );
    };

    return (
        <div className={styles.page_container}>
            <div className={'bg_scrolling'} />
            <h1 className={styles.title}>AI Tools</h1>
            <div className={styles.tick} />

            <div className={styles.ai_options}>
                <AICard
                    title='Summarizer'
                    description='Get a short summary of any short written passages. Request short, long, detailed, or simple summaries and finish with an extended view.'
                    image='/images/icons/ai/book.webp'
                    link='/ai/summarizer'
                />
                <AICard
                    title='Worksheet Creator'
                    description='Generate a full worksheet with multiple open ended questions. All questions are free response and generated using AI.'
                    image='/images/icons/ai/worksheet.webp'
                    link='/ai/worksheets'
                />
            </div>

            <div style={{ marginBottom: 150 }} />

            <Footer />
        </div>
    );
}