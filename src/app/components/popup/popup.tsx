'use client'

import styles from './popup.module.css';

export default function Popup(props: { open:boolean, setOpen:Function, exitButton:boolean, children:any }) {
    return(
        <>
            {props.open && 
                <div className={styles.popup_background}>
                    <div className={styles.popup}>
                        {props.exitButton && <p className={styles.popup_exit} onClick={() => props.setOpen(false)}>×</p>}
                        {props.children}
                    </div>
                </div>
            }
        </>
    );
}