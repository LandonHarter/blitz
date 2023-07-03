'use client'

import Link from "next/link";
import styles from "./header.module.css";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { signInWithGithub, signInWithGoogle, signInWithMicrosoft, signOut } from "@baas/login";
import useCurrentUser from "@hooks/useCurrentUser";
import Loading from "@components/loading/loading";
import useOutsideClick from "@/hooks/useOutsideClick";

import Popup from "../popup/popup";

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);

    const [avatarDropdown, setAvatarDropdown] = useState(false);
    const [avatarDropdownVisible, setAvatarDropdownVisible] = useState(false);

    const avatarDropdownRef = useRef(null);
    const loginModalRef = useRef(null);

    useOutsideClick(avatarDropdownRef, () => setAvatarDropdown(false));
    useOutsideClick(loginModalRef, () => setShowLogin(false));

    const { currentUser, signedIn, userLoading } = useCurrentUser();

    useEffect(() => {
        if (avatarDropdown) setAvatarDropdownVisible(true);
        else setTimeout(() => setAvatarDropdownVisible(false), 100);
    }, [avatarDropdown]);

    const Avatar = () => {
        return(
            <div className={styles.avatar_container}>
                <Image src={currentUser.pfp} alt="avatar" className={styles.avatar_image} width={42} height={42} onClick={() => {
                    setAvatarDropdown(!avatarDropdown);
                }} />

                <div className={`${styles.avatar_dropdown} ${avatarDropdownVisible ? (avatarDropdown ? styles.avatar_dropdown_visible : styles.avatar_dropdown_hidden_animation) : styles.avatar_dropdown_hidden}`} 
                ref={avatarDropdownRef}>
                    <Link href={`/profile/${currentUser.uid}`} className={styles.avatar_dropdown_option} onClick={() => {
                        setAvatarDropdown(false);
                    }}>
                        <Image src='/images/icons/user.png' alt='user' width={25} height={25} />
                        <p>PROFILE</p>
                    </Link>
                    <Link href='/my-sets' className={styles.avatar_dropdown_option} onClick={() => {
                        setAvatarDropdown(false);
                    }}>
                        <Image src='/images/icons/mysets.png' alt='user' width={25} height={25} />
                        <p>MY SETS</p>
                    </Link>
                    <Link href='/settings' className={styles.avatar_dropdown_option} onClick={() => {
                        setAvatarDropdown(false);
                    }}>
                        <Image src='/images/icons/settings.png' alt='user' width={25} height={25} />
                        <p>SETTINGS</p>
                    </Link>
                    <div className={styles.avatar_dropdown_option} onClick={() => {
                        signOut();
                        window.location.href = "/";
                        setAvatarDropdown(false);
                    }}>
                        <Image src='/images/icons/logout.png' alt='user' width={25} height={25} />
                        <p style={{color: "red"}}>SIGN OUT</p>
                    </div>
                </div>
            </div>
        );
    }

    if (userLoading) {
        return(<Loading />);
    }

    return(
        <div className={styles.header}>
            <div className={styles.header_nav}>
                <div className={styles.header_nav_left}>
                    <Link href='/' className={styles.header_logo}>
                        <Image style={{ aspectRatio:'1331/750' }} src='/bigicon.png' alt="logo" width={166} height={94} />
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
                    {!signedIn ? 
                        <div>
                            <button className={styles.signin_button} onClick={() => setShowLogin(true)}>Log In</button>
                        </div> : 
                        <div>
                            <Avatar />
                        </div>
                    }
                </div>
            </div>
            <Popup open={showLogin} setOpen={setShowLogin} exitButton>
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
                <div style={{ marginBottom: 30 }} />
            </Popup>
        </div>
    );
}