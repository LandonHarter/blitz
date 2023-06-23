'use client'

import Image from "next/image";

import styles from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
    return(
        <div className={styles.footer}>
            <div className={styles.footer_sections}>
                <div className={styles.company_details}>
                    <Image src='/bigicon-light.png' alt='blitz logo' width={125} height={70} />
                    <p className={styles.company_details_content}>
                        Blitz is a platform for teachers and students to connect and learn together through live games and personal study tools.
                    </p>
                </div>
                <div className={styles.footer_section_column}>
                    <h1>Pages</h1>

                    <ul className={styles.footer_section_column_list}>
                        <Link href='/' className={styles.footer_section_column_link}>Home</Link>
                        <Link href='/join' className={styles.footer_section_column_link}>Join</Link>
                        <Link href='/explore/sets' className={styles.footer_section_column_link}>Explore</Link>
                        <Link href='/about' className={styles.footer_section_column_link}>About</Link>
                    </ul>
                </div>
                <div className={styles.footer_section_column}>
                    <h1>Title</h1>

                    <ul className={styles.footer_section_column_list}>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                    </ul>
                </div>
                <div className={styles.footer_section_column}>
                    <h1>Title</h1>

                    <ul className={styles.footer_section_column_list}>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                        <Link href={''} className={styles.footer_section_column_link}>Link</Link>
                    </ul>
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