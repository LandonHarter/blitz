'use client'

import Image from "next/image";

import styles from "./footer.module.css";
import Link from "next/link";
import { useContext } from "react";
import DarkModeContext from "@/context/darkmode";
import MobileContext from "@/context/mobile";

export default function Footer() {
    const { get: darkMode } = useContext(DarkModeContext);
    const mobile = useContext(MobileContext);

    return (
        <div className={styles.footer} style={{
            backgroundColor: darkMode ? '' : 'var(--primary-dark)',
            borderTop: !darkMode ? '' : '1px solid var(--bg-darker)',
            '--footer-text-color': darkMode ? 'var(--text-color-light)' : 'var(--primary-light)'
        } as React.CSSProperties}>
            <div className={styles.footer_sections}>
                {!mobile &&
                    <div className={styles.company_details}>
                        <Image src='/bigicon-light.png' alt='blitz logo' width={125} height={70} />
                        <p className={styles.company_details_content}>
                            Blitz is a platform for teachers and students to connect and learn together through live games and personal study tools.
                        </p>
                    </div>
                }

                <div className={styles.footer_columns_container}>
                    <div className={styles.footer_section_column}>
                        <h1>Pages</h1>

                        <ul className={styles.footer_section_column_list}>
                            <Link href='/' className={styles.footer_section_column_link}>Home</Link>
                            <Link href='/join' className={styles.footer_section_column_link}>Join</Link>
                            <Link href='/explore/sets' className={styles.footer_section_column_link}>Explore</Link>
                            <Link href='/ai' className={styles.footer_section_column_link}>AI</Link>
                        </ul>
                    </div>
                    <div className={styles.footer_section_column}>
                        <h1>Company</h1>

                        <ul className={styles.footer_section_column_list}>
                            <Link href={'/about'} className={styles.footer_section_column_link}>About Us</Link>
                            <Link href={'/contact'} className={styles.footer_section_column_link}>Contact</Link>
                            <Link href={'/whyus'} className={styles.footer_section_column_link}>Why Us?</Link>
                            <Link href={'https://dev.to/landonharter'} target="_blank" className={styles.footer_section_column_link}>Development</Link>
                        </ul>
                    </div>
                    <div className={styles.footer_section_column}>
                        <h1>Technologies</h1>

                        <ul className={styles.footer_section_column_list}>
                            <Link href={'/ai'} className={styles.footer_section_column_link}>AI</Link>
                            <Link href={'/ai/summarizer'} className={styles.footer_section_column_link}>Summarizer</Link>
                            <Link href={'/ai/worksheets'} className={styles.footer_section_column_link}>Worksheet Generator</Link>
                            <Link href={'/citations'} className={styles.footer_section_column_link}>Citations</Link>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.footer_divider} />
            <div className={styles.footer_copyright}>
                <p>© 2023 Blitz. All rights reserved.</p>
                <div>
                    <Link href='/privacy'>Privacy Policy</Link>
                    <Link href='/terms'>Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}