import { useContext } from 'react';
import styles from './setcard.module.css';
import UserContext from '@/context/usercontext';
import { HeartSVG } from '@/svg';
import { likeSet, unlikeSet } from '@/backend/set';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClassicGame } from '@/backend/live/game';
import { useState } from 'react';
import Popup from '../popup/popup';
import Image from 'next/image';

export default function SetCard(props: { set: any }) {
    const set = props.set;
    const router = useRouter();
    const { currentUser, signedIn, updateUserData } = useContext(UserContext);

    const [numLikes, setNumLikes] = useState(set.likes || 0);
    const [liked, setLiked] = useState((currentUser.likedSets || {})[set.id] || false);
    const [finishedLiking, setFinishedLiking] = useState(true);

    const [error, setError] = useState('');
    const [errorOpen, setErrorOpen] = useState(false);

    return (
        <article className={styles.set_card}>
            <div className={styles.article_wrapper}>
                <figure style={{ backgroundImage: `url(${set.image})` }}>

                </figure>
                <div className={styles.article_body}>
                    <Link href={`/set/${set.id}`} className={styles.link_decoration}><h2 onClick={() => {
                    }}>{set.name}</h2></Link>
                    <p>Created by {set.ownerName}</p>
                </div>
                <div className={styles.card_footer}>
                    <div className={styles.likes_container}>
                        <div onClick={async () => {
                            if (currentUser.empty || !finishedLiking) return;

                            setFinishedLiking(false);
                            if (!liked) {
                                setNumLikes(numLikes + 1);
                                setLiked(true);
                                await likeSet(set.id, currentUser, updateUserData);
                            }
                            else {
                                setNumLikes(numLikes - 1);
                                setLiked(false);
                                await unlikeSet(set.id, currentUser, updateUserData);
                            }
                            setFinishedLiking(true);
                        }}>
                            <HeartSVG className={`${styles.heart} ${liked && styles.heart_liked}`} />
                        </div>
                        <p>{numLikes} like{numLikes !== 1 && 's'}</p>
                    </div>
                    <button onClick={async () => {
                        if (!signedIn) {
                            // TODO: set error
                            return;
                        }

                        const {
                            success,
                            gameCode,
                        } = await createClassicGame(currentUser.uid, set.id);

                        if (success) {
                            router.push(`/host/${gameCode}`);
                        } else {
                            setError('There was an error creating the game. Please try again.');
                            setErrorOpen(true);
                        }
                    }}>Host Live</button>
                </div>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <p className='popup_error'>{error}</p>
            </Popup>
        </article>
    )
}