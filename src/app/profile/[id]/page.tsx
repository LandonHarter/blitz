'use client'

import { usePathname } from 'next/navigation';
import styles from './page.module.css';
import { useContext, useEffect, useState } from 'react';
import Loading from '@/components/loading/loading';
import BasicReturn from '@/components/basic-return/return';
import Image from 'next/image';
import { User, getUserData } from '@/backend/firebase/user';
import { formatTimestampDate } from '@/backend/util';
import { createGame } from '@/backend/live/game';
import { useRouter } from 'next/navigation';
import 'cooltipz-css';
import Link from 'next/link';
import UserContext from '@/context/usercontext';
import Popup from '@/components/popup/popup';

export default function ProfilePage() {
    const router = useRouter();
    const userId = usePathname().split('/')[2];

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const { currentUser, signedIn, userLoading } = useContext(UserContext);
    const [background, setBackground] = useState<string>('linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)');

    const [errorOpen, setErrorOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        (async () => {
            const userData = await getUserData(userId);
            setUser(userData);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (<Loading />);
    }

    if (!user) {
        return (<BasicReturn text='User does not exist' returnLink='/' />);
    }

    if (!user.createdAt) {
        return (<BasicReturn text='Error loading user' returnLink='/' />);
    }

    return (
        <div className={styles.profile_container}>
            <div className={styles.background_art} style={{ backgroundImage: background }}>
                <Image src={user.pfp} alt='user profile picture' width={150} height={150} className={styles.user_pfp} />
                <button className={styles.verified_container} aria-label='Verified Teacher' data-cooltipz-dir="bottom"><Image src='/images/icons/verified.png' alt='verified' width={40} height={40} className={styles.verified_badge} /></button>
            </div>
            <div className={styles.user_info}>
                <h1 className={styles.user_name}>{user.name}</h1>
                <p className={styles.user_subtitle}>Joined {formatTimestampDate(user.createdAt)}</p>
            </div>

            <div className={styles.all_sets}>
                {user.sets.map((set, index) => {
                    return (
                        <article key={index} className={styles.set_card}>
                            <div className={styles.article_wrapper}>
                                <figure style={{ backgroundImage: `url(${set.image})` }}>

                                </figure>
                                <div className={styles.article_body}>
                                    <Link href={`/set/${set.id}`} className={styles.link_decoration}><h2 onClick={() => {
                                    }}>{set.name}</h2></Link>
                                    <p>{set.description}</p>
                                </div>
                                <div className={styles.card_footer}>
                                    <div />
                                    <div>
                                        <button onClick={async () => {
                                            if (!signedIn) {
                                                setError('You must be signed in to host a live game.');
                                                setErrorOpen(true);
                                                return;
                                            }

                                            setLoading(true);
                                            const {
                                                success,
                                                error,
                                                gameCode
                                            } = await createGame(currentUser.uid, set.id);

                                            if (success) {
                                                router.push(`/host/${gameCode}`);
                                            } else {
                                                setError(error);
                                                setErrorOpen(true);
                                                setLoading(false);
                                            }
                                        }}>Host Live</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <p className={styles.popup_error}>{error}</p>
            </Popup>
        </div>
    );
}