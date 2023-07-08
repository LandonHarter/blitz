'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GameUser } from '@/backend/live/user';
import styles from './endgame.module.css';
import ReactConfetti from 'react-confetti';
import { getRandomEndGamePhraseSeed } from '@/backend/phrase';
import { getUsersInGame, deleteGame } from '@/backend/live/game';

export default function HostEndGame(props: { gameCode:string, users: GameUser[] }) {
    const phrase = getRandomEndGamePhraseSeed(props.users.length);
    const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });

    const [sortedUsers, setSortedUsers] = useState<GameUser[]>(props.users);

    const leaderboard = useRef<HTMLDivElement>(null);
    const leaderboardInView = useInView(leaderboard, { once: false, margin: '-100px' });

    const getUpdatedUsers = async () => {
        const usersInGame:GameUser[] = await getUsersInGame(props.gameCode);
        const returnUsers:GameUser[] = [];
        usersInGame.forEach((user) => {
            if (props.users.find((u) => u.uid === user.uid) !== undefined) {
                returnUsers.push(user);
            }
        });

        return returnUsers;
    };

    const getUpdatedPoints = async (updatedUsers:GameUser[], user:GameUser) => {
        const updatedUser = updatedUsers.find((u) => u.uid === user.uid);
        if (updatedUser === undefined) return 0;

        return updatedUser.points;
    };

    const sortUsers = async () => {
        const updatedUsers = await getUpdatedUsers();

        updatedUsers.sort((a, b) => {
            const aPoints = getUpdatedPoints(updatedUsers, a);
            const bPoints = getUpdatedPoints(updatedUsers, b);

            if (aPoints > bPoints) {
                return 1;
            } else if (aPoints < bPoints) {
                return -1;
            } else {
                return 0;
            }
        });

        setSortedUsers(updatedUsers);
    }

    useEffect(() => {
        setConfettiSize({
            width: window.innerWidth,
            height: window.innerHeight * 2
        });
        sortUsers();
        deleteGame(props.gameCode);
    }, []);

    return(
        <div>
            <ReactConfetti width={confettiSize.width} height={confettiSize.height} numberOfPieces={400} />

            <div className={styles.congrats_section}>
                <h1 className={styles.congrats_label}>{phrase}</h1>
                <motion.button whileTap={{ scale: 0.95 }} className={styles.view_leaderboard} onClick={() => {
                    if (leaderboard.current === null) return;
                    leaderboard.current.scrollIntoView({ behavior: 'smooth' });
                }}>View Leaderboard</motion.button>
            </div>

            <motion.div className={styles.leaderboard_section} ref={leaderboard} initial={{ opacity: 1 }} animate={{ opacity: leaderboardInView ? 1 : 0 }} transition={{ duration: 0.5 }}>
                <div className={styles.leaderboard_top_section}>
                    <h1 className={styles.leaderboard_label}>Leaderboard</h1>
                </div>
                <div className={styles.leaderboard_bottom_section}>
                    <div className={`${styles.container} ${styles.podium}`}>
                        <div className={styles.podium__item}>
                            <motion.h1 initial={{ translateY: '200px' }} animate={{ translateY: leaderboardInView ? 0 : '200px' }} transition={{ duration: 1 }} className={styles.podium_winner}>
                                {sortedUsers.length > 1 ? sortedUsers[1].name : 'N/A'}
                            </motion.h1>
                            <motion.div initial={{ transformOrigin: 'bottom', scaleY: 0.75 }} animate={{ transformOrigin: 'bottom', scaleY: leaderboardInView ? 1 : 0 }} transition={{ duration: 1 }} className={`${styles.podium__rank} ${styles.second}`}>
                                2
                            </motion.div>
                        </div>
                        <div className={styles.podium__item}>
                            <motion.h1 initial={{ translateY: '300px' }} animate={{ translateY: leaderboardInView ? 0 : '300px' }} transition={{ duration: 1 }} className={styles.podium_winner}>
                                {sortedUsers.length > 0 ? sortedUsers[0].name : 'N/A'}
                            </motion.h1>
                            <motion.div initial={{ transformOrigin: 'bottom', scaleY: 0.9 }} animate={{ transformOrigin: 'bottom', scaleY: leaderboardInView ? 1 : 0 }} transition={{ duration: 1 }} className={`${styles.podium__rank} ${styles.first}`}>
                                1
                            </motion.div>
                        </div>
                        <div className={styles.podium__item}>
                            <motion.h1 initial={{ translateY: '100px' }} animate={{ translateY: leaderboardInView ? 0 : '100px' }} transition={{ duration: 1 }} className={styles.podium_winner}>
                                {sortedUsers.length > 2 ? sortedUsers[2].name : 'N/A'}
                            </motion.h1>
                            <motion.div initial={{ transformOrigin: 'bottom', scaleY: 0.5 }} animate={{ transformOrigin: 'bottom', scaleY: leaderboardInView ? 1 : 0 }} transition={{ duration: 1 }} className={`${styles.podium__rank} ${styles.third}`}>
                                3
                            </motion.div>
                        </div>
                    </div>
                    <div className={styles.completed_leaderboard}>
                        <div className={styles.leaderboard}>
                            <h1>Leaderboard</h1>
                            <div className={styles.leaderboard_divider} />
                            <div className={styles.leaderboard_categories}>
                                <p>User</p>
                                <p>Points</p>
                        </div>
                        {sortedUsers.map((user, index) => {
                            return(
                                <div key={index}>
                                    <div className={`${styles.leaderboard_place} ${index % 2 > 0 && styles.leaderboard_place_dark}`}>
                                        <div className={styles.basic_user_data}>
                                            <p className={styles.rank}>{index + 1}.</p>
                                            <img src={user.pfp} className={styles.place_pfp} onError={(e) => {
                                                e.currentTarget.src = "/images/user.jpg";
                                            }} />
                                            <p className={styles.place_name}>{user.name}</p>
                                        </div>
                                        <p className={styles.points}>{user.points}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}