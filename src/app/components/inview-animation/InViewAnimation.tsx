'use client'

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Animation } from "@/animation/animation";

export default function InViewAnimation(props: { children: any, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null);
    const inView = useInView(divRef, {
        margin: '-100px',
        once: true
    });

    return (
        <motion.div ref={divRef} initial={{
            opacity: 0,
            y: 50,
        }} animate={{
            opacity: inView ? 1 : 0,
            y: inView ? 0 : 50,
        }} transition={{
            duration: 0.5
        }} className={props.className}>
            {props.children}
        </motion.div>
    )
}