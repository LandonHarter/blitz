'use client'

import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './popup.module.css';
import useOutsideClick from '@/hooks/useOutsideClick';
import { fade } from '@/animation/animation';
import AnimationDiv from '@/animation/AnimationDiv';

export default function Popup(props: { open: boolean, setOpen?: Function, close?: any, exitButton: boolean, children: any, closeOnOutsideClick?: boolean }) {
    const popupRef = useRef(null);
    useOutsideClick(popupRef, () => {
        if (props.closeOnOutsideClick !== undefined && !props.closeOnOutsideClick) return;
        if (props.setOpen) props.setOpen(false);
        if (props.close) props.close();
    });

    return (
        <AnimatePresence initial={false} mode='wait'>
            {props.open &&
                <AnimationDiv className={styles.popup_background} animation={fade} duration={0.1}>
                    <div className={styles.popup} ref={popupRef}>
                        {props.exitButton && <p className={styles.popup_exit} onClick={() => {
                            if (props.setOpen) props.setOpen(false);
                            if (props.close) props.close();
                        }}>×</p>}
                        {props.children}
                    </div>
                </AnimationDiv>
            }
        </AnimatePresence>
    );
}