'use client'

import styles from './tooltip.module.css';

export default function Tooltip(props: { children: any, text: string, position: string }) {
    return (
        <button aria-label={props.text} data-cooltipz-dir={props.position} className={styles.empty_button}>
            {props.children}
        </button>
    )
}