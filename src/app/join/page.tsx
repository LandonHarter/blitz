'use client'

import useCurrentUser from '@hooks/useCurrentUser';
import styles from './page.module.css';

import Image from 'next/image';
import { useContext, useRef } from 'react';
import { createGame, joinGame } from '@/backend/live/game';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Popup from '@/components/popup/popup';
import Loading from '@/components/loading/loading';
import NeedSignin from '@/components/require-signin/needsignin';
import UserContext from '@/context/usercontext';

export default function JoinPage() {
    const router = useRouter();
    const joinInput = useRef<HTMLInputElement>(null);
    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    const [joining, setJoining] = useState(false);

    const [errorOpen, setErrorOpen] = useState(false);
    const [error, setError] = useState("");

    const [infoOpen, setInfoOpen] = useState(false);
    const [info, setInfo] = useState("");

    if (userLoading) {
        return (<Loading />);
    } else if (!signedIn) {
        return (<NeedSignin />);
    }

    return (
        <div className={styles.background}>
            <div className={styles.content}>
                <Image src='/bigicon.png' alt="logo" width={333} height={187.5} priority />
                <input type="text" ref={joinInput} className={styles.join_input} placeholder="Join Code" maxLength={6} onKeyDown={(e) => { if (!/[a-z]/i.test(e.key)) e.preventDefault() }} />
                <button className={joining ? styles.join_button_joining : styles.join_button} onClick={async () => {
                    if (joinInput.current === null || currentUser === null) return;
                    if (joinInput.current.value.length !== 6) {
                        setError("Invalid Join Code");
                        setErrorOpen(true);
                        return;
                    }

                    setJoining(true);

                    const { success, error } = await joinGame(joinInput.current.value, currentUser);
                    if (success) {
                        router.push(`/live/${joinInput.current.value.toUpperCase()}`);
                    } else {
                        setError(error);
                        setErrorOpen(true);
                        setJoining(false);
                    }
                }} disabled={joining}>{joining ? 'Joining...' : 'Join'}</button>
            </div>

            <Popup open={errorOpen} setOpen={setErrorOpen} exitButton>
                <Image src='/images/icons/error.png' alt='error' width={60} height={60} style={{ marginBottom: 25 }} />
                <h1 className={styles.popup_error}>{error}</h1>
            </Popup>

            <Popup open={infoOpen} setOpen={setInfoOpen} exitButton>
                <h1 className={styles.popup_error}>{info}</h1>
            </Popup>
        </div>
    );
}