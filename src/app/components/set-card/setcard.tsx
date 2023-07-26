import { useContext } from 'react';
import styles from './setcard.module.css';
import UserContext from '@/context/usercontext';
import { HeartSVG } from '@/svg';
import { likeSet, unlikeSet } from '@/backend/set';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createGame } from '@/backend/live/game';
import { useState } from 'react';

export default function SetCard(props: { set: any }) {
    const set = props.set;
    const router = useRouter();
    const { currentUser, signedIn, updateUserData } = useContext(UserContext);

    const [numLikes, setNumLikes] = useState(set.likes || 0);
    const [liked, setLiked] = useState((currentUser.likedSets || []).includes(set.id));
    const [finishedLiking, setFinishedLiking] = useState(true);

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
                            error,
                            gameCode
                        } = await createGame(currentUser.uid, set.id);

                        if (success) {
                            router.push(`/host/${gameCode}`);
                        } else {
                            // TODO: set error
                        }
                    }}>Host Live</button>
                </div>
            </div>
        </article>
    )
}