'use client'

import { motion } from "framer-motion"

export default function StudyMethodContainer(props: { children: any }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ width: '100%' }}>
            {props.children}
        </motion.div>
    )
}