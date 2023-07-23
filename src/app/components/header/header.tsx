'use client'

import Link from "next/link";
import styles from "./header.module.css";

import Image from "next/image";
import { useState, useRef, useContext, useEffect } from "react";
import { signInWithGithub, signInWithGoogle, signInWithMicrosoft, signOut } from "@baas/login";
import Loading from "@components/loading/loading";
import useOutsideClick from "@/hooks/useOutsideClick";

import Popup from "@components/popup/popup";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import AnimationDiv from "@/animation/AnimationDiv";
import { dropdown } from "@/animation/animation";
import SignInContext from "@/context/signincontext";
import UserContext from "@/context/usercontext";
import { useRouter } from "next/navigation";
import DarkModeContext from "@/context/darkmode";

export default function Header() {
    const signInPopup = useContext(SignInContext);
    const [avatarDropdown, setAvatarDropdown] = useState(false);

    const avatarDropdownRef = useRef(null);
    const loginModalRef = useRef(null);

    const { get: darkMode, set: setDarkMode } = useContext(DarkModeContext);

    useOutsideClick(avatarDropdownRef, () => setAvatarDropdown(false));
    useOutsideClick(loginModalRef, () => signInPopup.set(false));

    const { currentUser, signedIn, userLoading } = useContext(UserContext);

    if (userLoading) {
        return (<Loading />);
    }

    return (
        <div className={styles.header}>
            <div className={styles.header_nav}>
                <div className={styles.header_nav_left}>
                    <Link href='/' className={styles.header_logo}>
                        <Image style={{ aspectRatio: '1331/750' }} src={!darkMode ? '/bigicon.png' : '/bigicon-light.png'} alt="logo" width={166} height={94} priority />
                    </Link>
                    <div className={styles.nav_links}>
                        <Link href='/join' className={styles.nav_link}>Join</Link>
                        <Link href='/create' className={styles.nav_link}>Create</Link>
                        <Link href='/explore/sets' className={styles.nav_link}>Explore</Link>
                        <Link href='/ai' className={styles.nav_link}>
                            <div className={styles.nav_link_content}><p className={styles.link_text}>AI</p> <div className={styles.badge}><p>Beta</p></div></div>
                        </Link>
                    </div>
                </div>
                <div className={styles.header_nav_right}>
                    <div className={styles.toggle_wrapper}>
                        <input type="checkbox" className={styles.dn} id="dn" checked={darkMode} onChange={(e) => {
                            setDarkMode(e.target.checked);
                        }} />
                        <label htmlFor="dn" className={styles.toggle}>
                            <span className={styles.toggle__handler}>
                                <span className={`${styles.crater} ${styles.crater1}`} />
                                <span className={`${styles.crater} ${styles.crater2}`} />
                                <span className={`${styles.crater} ${styles.crater3}`} />
                            </span>
                            <span className={`${styles.star} ${styles.star1}`} />
                            <span className={`${styles.star} ${styles.star2}`} />
                            <span className={`${styles.star} ${styles.star3}`} />
                            <span className={`${styles.star} ${styles.star4}`} />
                            <span className={`${styles.star} ${styles.star5}`} />
                            <span className={`${styles.star} ${styles.star6}`} />
                        </label>
                    </div>
                    {!signedIn ?
                        <div>
                            <button className={styles.signin_button} onClick={() => signInPopup.set(true)}>Log In</button>
                        </div> :
                        <div className={styles.avatar_container}>
                            <Image src={currentUser.pfp} alt="avatar" className={styles.avatar_image} width={42} height={42} onClick={() => {
                                setAvatarDropdown(!avatarDropdown);
                            }} priority />

                            <AnimatePresence initial={false} mode='wait'>
                                {avatarDropdown &&
                                    <AnimationDiv animation={dropdown} duration={0.1} className={styles.avatar_dropdown}>
                                        <Link href={`/profile/${currentUser.uid}`} className={styles.avatar_dropdown_option} onClick={() => {
                                            setAvatarDropdown(false);
                                        }}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/user.png`} alt='user' width={25} height={25} />
                                            <p>PROFILE</p>
                                        </Link>
                                        <Link href='/my-sets' className={styles.avatar_dropdown_option} onClick={() => {
                                            setAvatarDropdown(false);
                                        }}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/mysets.png`} alt='user' width={25} height={25} />
                                            <p>MY SETS</p>
                                        </Link>
                                        <Link href='/settings' className={styles.avatar_dropdown_option} onClick={() => {
                                            setAvatarDropdown(false);
                                        }}>
                                            <Image src={`/images/icons/${darkMode ? 'dark' : 'light'}/settings.png`} alt='user' width={25} height={25} />
                                            <p>SETTINGS</p>
                                        </Link>
                                        <div className={styles.avatar_dropdown_option} onClick={() => {
                                            signOut();
                                            setAvatarDropdown(false);
                                        }}>
                                            <Image src='/images/icons/logout.png' alt='user' width={25} height={25} />
                                            <p style={{ color: "red" }}>SIGN OUT</p>
                                        </div>
                                    </AnimationDiv>
                                }
                            </AnimatePresence>
                        </div>
                    }
                </div>
            </div>

            <Popup open={signInPopup.get} setOpen={signInPopup.set} exitButton>
                <h1 className={styles.login_modal_title}>Login</h1>
                <p className={styles.login_modal_subtitle}>Sign in to start creating!</p>

                <motion.button whileTap={{ scale: 0.95 }} transition={{ duration: 0.05 }} className={styles.provider_button} onClick={() => signInWithGoogle().finally(() => signInPopup.set(false))}>
                    <Image src='/images/providers/google.png' alt="google" width={25} height={25} />
                    Sign in with Google
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} transition={{ duration: 0.05 }} className={styles.provider_button} onClick={() => signInWithMicrosoft().finally(() => signInPopup.set(false))}>
                    <Image src='/images/providers/microsoft.png' alt="microsoft" width={25} height={25} />
                    Sign in with Microsoft
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} transition={{ duration: 0.05 }} className={styles.provider_button} onClick={() => signInWithGithub().finally(() => signInPopup.set(false))}>
                    <Image src={`/images/providers/github${darkMode ? '-light' : ''}.png`} alt="github" width={25} height={25} />
                    Sign in with Github
                </motion.button>
                <div style={{ marginBottom: 30 }} />
            </Popup>
        </div>
    );
}