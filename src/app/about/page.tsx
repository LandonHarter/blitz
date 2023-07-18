'use client'

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getMetrics } from "@/backend/firebase/analytics";
import Loading from "@/components/loading/loading";
import { formatNumber } from "@/backend/util";
import Footer from "@/components/footer/footer";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    const [metrics, setMetrics] = useState<{
        numUsers: number,
        numSets: number,
        numGamesPlayed: number,
    } | null>(null);

    useEffect(() => {
        (async () => {
            const metricsData = await getMetrics();
            setMetrics(metricsData);
        })();
    }, []);

    if (!metrics) {
        return (<Loading />);
    }

    return (
        <div className={styles.about}>
            <div className={styles.hero}>
                <div className={styles.hero_left}>
                    <div className={styles.text_container}>
                        <h1 className={styles.small_title}>Nice to meet you</h1>
                        <h1 className={styles.big_title}>Our goal is to improve the studying and learning process</h1>
                    </div>
                </div>
                <div className={styles.hero_right}>
                    <p className={styles.subtitle}>Blitz is an educational platform that aims to help students and teachers, in and out of the classroom. Use various study methods and live in class games that boost productivity and learning capacity.</p>
                </div>
            </div>
            <div className={styles.stats_banner}>
                <div className={styles.stats}>
                    <h1 className={styles.stats_number}>{formatNumber(metrics.numUsers)}</h1>
                    <h1 className={styles.stats_text}>Total Users</h1>
                </div>
                <div className={styles.stats}>
                    <h1 className={styles.stats_number}>{formatNumber(metrics.numSets)}</h1>
                    <h1 className={styles.stats_text}>Total Sets</h1>
                </div>
                <div className={styles.stats}>
                    <h1 className={styles.stats_number}>{formatNumber(metrics.numGamesPlayed)}</h1>
                    <h1 className={styles.stats_text}>Games Played</h1>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.section_content}>
                    <h1 className={styles.section_small_title}>Our Story</h1>
                    <h1 className={styles.section_big_title}>Blitzing Onto the Scene</h1>
                    <div className={styles.story_text_content}>
                        <p className={styles.story_text} style={{ marginRight: 75 }}>
                            Blitz has been a passion project of Landon Harter. After struggling with effective studying and frustration with available online resources, he began development on his ideal tools and working environment.<br /><br />
                            Studying and classroom tools are beginning to cost users, offering premium plans for basic features. Blitz believes in free content for everyone. No one should be locked behind a paywall.<br /><br />
                            Can one high school developer really make a dent in the education industry? Landon Harter likes to believe he can, and is excited for the future of the platform. He doesn&apos;t care how many people are using the service, but rather their experience and successes with the platform.<br /><br />
                        </p>
                        <p className={styles.story_text}>
                            Even if nobody uses Blitz, Landon still enjoys working on the project and using the tool for himself. He includes his favorite and effective techniques that he enjoys in his education.<br /><br />
                            Blitz makes no money and spends money to deliver the best experience possible. If you would like to support the project, please consider donating to the project. All donations go towards server costs and development.<br /><br />
                            You can reach out at our <a href="mailto:lhartercomputerscience@gmail.com" target="_blank">email</a>, or visit our <Link href='/contact'>Contact Page</Link> for more details.
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.section_content}>
                    <h1 className={styles.section_small_title}>The Team</h1>
                    <h1 className={styles.section_big_title}>All Developers</h1>
                    <div className={styles.portrait}>
                        <div className={styles.portrait_data}>
                            <div>
                                <h1 className={styles.portrait_name}>Landon Harter</h1>
                                <h1 className={styles.portrait_title}>Founder & Lead Developer</h1>
                            </div>
                            <div className={styles.portrait_links}>
                                <Link href='https://github.com/LandonHarter' target="_blank" className={styles.portrait_link} style={{ marginLeft: 0 }}><Image src='/images/providers/github.png' alt="" width={30} height={30} /></Link>
                                <Link href='https://twitter.com/harter_landon' target="_blank" className={styles.portrait_link}><Image src='/images/providers/twitter.png' alt="" width={30} height={30} /></Link>
                                <Link href='mailto:landonharter@outlook.com' target="_blank" className={styles.portrait_link}><Image src='/images/providers/email.png' alt="" width={30} height={30} /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 125 }} />

            <Footer />
        </div>
    );
}