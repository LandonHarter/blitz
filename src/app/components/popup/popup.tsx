'use client'

import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './popup.module.css';
import useOutsideClick from '@/hooks/useOutsideClick';
import { fade } from '@/animation/animation';
import AnimationDiv from '@/animation/AnimationDiv';

export default function Popup(props: { open:boolean, setOpen:Function, exitButton:boolean, children:any }) {
    const popupRef = useRef(null);
    useOutsideClick(popupRef, () => props.setOpen(false));

    return(
        <AnimatePresence initial={false} mode='wait'>
            {props.open && 
                <AnimationDiv className={styles.popup_background} animation={fade} duration={0.1}>
                    <div className={styles.popup} ref={popupRef}>
                        {props.exitButton && <p className={styles.popup_exit} onClick={() => props.setOpen(false)}>×</p>}
                        {props.children}
                    </div>
                </AnimationDiv>
            }
        </AnimatePresence>
    );
}