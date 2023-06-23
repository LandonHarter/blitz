'use client'

import { useEffect, useState } from 'react';
import styles from './popup.module.css';

export default function Popup(props: { open:boolean, setOpen:Function, exitButton:boolean, children:any }) {
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        if (props.open) setPopupVisible(true);
        else setTimeout(() => setPopupVisible(false), 50);
    }, [props.open]);

    return(
        <>
            <div className={`${styles.popup_background} ${popupVisible ? (props.open ? styles.popup_visible : styles.popup_hidden_animation) : styles.popup_hidden}`}>
                <div className={styles.popup}>
                    {props.exitButton && <p className={styles.popup_exit} onClick={() => props.setOpen(false)}>×</p>}
                    {props.children}
                </div>
            </div>
        </>
    );
}