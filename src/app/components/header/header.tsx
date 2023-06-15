'use client'

import Link from "next/link";
import styles from "./header.module.css";

import Image from "next/image";
import { useState } from "react";
import { signInWithGithub, signInWithGoogle, signInWithMicrosoft } from "@/backend/firebase/login";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const { currentUser, signedIn } = useCurrentUser();

    const LoginModal = () => {
        return(
            <>
                {showLogin && 
                    <div className={styles.login_modal_background}>
                        <div className={styles.login_modal}>
                            <div className={styles.login_modal_content}>
                                <h1 className={styles.login_modal_title}>Login</h1>
                                <p className={styles.login_modal_subtitle}>Sign in to start creating!</p>

                                <button className={styles.provider_button} onClick={() => signInWithGoogle().finally(() => setShowLogin(false))}>
                                    <Image src='/images/providers/google.png' alt="google" width={25} height={25} />
                                    Sign in with Google
                                </button>
                                <button className={styles.provider_button} onClick={() => signInWithMicrosoft().finally(() => setShowLogin(false))}>
                                    <Image src='/images/providers/microsoft.png' alt="microsoft" width={25} height={25} />
                                    Sign in with Microsoft
                                </button>
                                <button className={styles.provider_button} onClick={() => signInWithGithub().finally(() => setShowLogin(false))}>
                                    <Image src='/images/providers/github.png' alt="github" width={25} height={25} />
                                    Sign in with Github
                                </button>
                            </div>

                            <p className={styles.login_modal_exit} onClick={() => setShowLogin(false)}>×</p>
                        </div>
                    </div>
                }
            </>
        )
    };

    return(
        <div className={styles.header}>
            <div className={styles.header_nav}>
                <div className={styles.header_nav_left}>
                    <Link href='/' className={styles.header_logo}>
                        <Image src='/icon.png' alt="logo" width={40} height={40} />
                        <h1>BLITZ!</h1>
                    </Link>
                </div>
                <div className={styles.header_nav_right}>
                    {!signedIn ? 
                        <div>
                            <button className={styles.signin_button} onClick={() => setShowLogin(true)}>Log In</button>
                        </div> : 
                        <div>
                            <h1>{currentUser.name}</h1>
                        </div>
                    }
                </div>
            </div>
            <LoginModal />
        </div>
    );
}