'use client'

import { GameUser } from '@/backend/live/user';
import styles from './pregame.module.css';

import { AnimatePresence, motion } from 'framer-motion';
import Popup from '@/components/popup/popup';
import { useState } from 'react';
import { springScale } from '@/animation/animation';
import { kickPlayer } from '@/backend/live/game';
import { getRandomColor } from '@/backend/color';

export default function PreGame(props: { gameId: string, users: GameUser[], start: () => Promise<any>, end: () => Promise<any> }) {
    const [codeFullscreen, setCodeFullscreen] = useState(false);
    const [userPopup, setUserPopup] = useState(false);
    const [popupUser, setPopupUser] = useState<GameUser | null>(null);
    const [loadingKick, setLoadingKick] = useState(false);
    
    return(
        <div className={styles.pregame_container}>
            <div className={styles.top_bar}>
                <h1 className={styles.num_players}>{props.users.length} Players</h1>

                <div className={styles.control_buttons}>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={props.start}>Start</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={props.end}>End</motion.button>
                </div>
            </div>

            <div className={styles.players_container}>
                {props.users.map((user, index) => {
                    return(
                        <AnimatePresence key={index}>
                            <motion.div
                            initial={springScale.initial} animate={springScale.animate} exit={springScale.exit}
                            transition={{ duration: 0.75, type: 'spring', bounce: 0.25 }}
                            className={styles.player}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setPopupUser(user);
                                setUserPopup(true);
                            }}
                            >
                                <h1>{user.name}</h1>
                            </motion.div>
                        </AnimatePresence>
                    );
                })}
            </div>

            <div className={styles.bottom_bar}>
                <div className={styles.code_container}>
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                        setCodeFullscreen(true);
                    }}>
                        <path d="M21.7092 2.29502C21.8041 2.3904 21.8757 2.50014 21.9241 2.61722C21.9727 2.73425 21.9996 2.8625 22 2.997L22 3V9C22 9.55228 21.5523 10 21 10C20.4477 10 20 9.55228 20 9V5.41421L14.7071 10.7071C14.3166 11.0976 13.6834 11.0976 13.2929 10.7071C12.9024 10.3166 12.9024 9.68342 13.2929 9.29289L18.5858 4H15C14.4477 4 14 3.55228 14 3C14 2.44772 14.4477 2 15 2H20.9998C21.2749 2 21.5242 2.11106 21.705 2.29078L21.7092 2.29502Z" fill="#000000"/>
                        <path d="M10.7071 14.7071L5.41421 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H3.00069L2.997 22C2.74301 21.9992 2.48924 21.9023 2.29502 21.7092L2.29078 21.705C2.19595 21.6096 2.12432 21.4999 2.07588 21.3828C2.02699 21.2649 2 21.1356 2 21V15C2 14.4477 2.44772 14 3 14C3.55228 14 4 14.4477 4 15V18.5858L9.29289 13.2929C9.68342 12.9024 10.3166 12.9024 10.7071 13.2929C11.0976 13.6834 11.0976 14.3166 10.7071 14.7071Z" fill="#000000"/>
                    </svg>
                    <h1>{props.gameId}</h1>
                </div>
            </div>

            <Popup open={codeFullscreen} setOpen={setCodeFullscreen} exitButton>
                <h1 className={styles.fullscreen_code}>{props.gameId}</h1>
            </Popup>
            <Popup open={userPopup} setOpen={setUserPopup} exitButton>
                {loadingKick ?
                    <h1 className={styles.player_name}>Kicking...</h1>
                :   <>
                        <h1 className={styles.player_name}>{popupUser?.name}</h1>
                        <motion.button className={styles.kick_player} onClick={async () => {
                            if (!popupUser) return;

                            setLoadingKick(true);
                            await kickPlayer(props.gameId, popupUser);
                            setLoadingKick(false);
                            setUserPopup(false);
                            setPopupUser(null);
                        }} whileTap={{ scale: 0.95 }}>Kick Player</motion.button>
                    </>
                }
            </Popup>
        </div>
    );
}