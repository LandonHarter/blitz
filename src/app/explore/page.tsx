import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Footer from '@/components/footer/footer';

export default function ExplorePage() {
    const ExploreCard = (props: { name: string, description: string, image: string, link: string }) => {
        return (
            <Link href={props.link} className={styles.explore_card}>
                <div className={styles.explore_card_top}>
                    <Image src={props.image} width={60} height={60} alt='explore logo' />
                    <h1>{props.name}</h1>
                </div>

                <p>{props.description}</p>
            </Link>
        );
    };

    return (
        <div >
            <div className='bg_scrolling' />

            <div style={{
                minHeight: 'calc(100vh - 134px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <h1 className={styles.title}>Explore Content</h1>
                <div className={styles.tick} />

                <div className={styles.explore_pages}>
                    <ExploreCard name='Sets' description='Explore countless sets made by the Blitz community' image='/images/icons/explore/sets.webp' link='/explore/sets' />
                    <ExploreCard name='Courses' description='Learn something new or get help with free courses' image='/images/icons/explore/courses.webp' link='/explore/courses' />
                    <ExploreCard name='Users' description='Find people in the Blitz community that are just like you' image='/images/icons/explore/community.webp' link='/explore/users' />
                </div>
            </div>

            <Footer />
        </div>
    );
}