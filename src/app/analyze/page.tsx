'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.css';
import { gradeFromScore } from "@/backend/util";

export default function AnalyzeReportPage() {
    const searchParams = useSearchParams();
    const [reportData, setReportData] = useState<any>(null);

    useEffect(() => {
        const reportDataString = searchParams.get('reportData');
        if (reportDataString) {
            setReportData(JSON.parse(reportDataString));
            console.log(JSON.parse(reportDataString));
        }
    }, [searchParams]);

    return (
        <div>
            <div className={styles.hero}>
                <div className={styles.hero_left}>
                    <div className={styles.correct_circle}>
                        <svg width="100%" height="100%" viewBox="0 0 42 42">
                            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="red" strokeWidth="3" />
                            <circle className={styles.correct_ring} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="green" strokeWidth="3" style={{
                                strokeDashoffset: 100 - reportData?.pct,
                            }} />
                        </svg>
                        <h1 className={styles.total_pct}>{reportData?.pct}%</h1>
                    </div>
                    <div className={styles.individual_stats}>
                        <div className={styles.individual_stat}>
                            <h1 className={styles.individual_stat_num}>{reportData?.correct}</h1>
                            <h1 className={styles.individual_stat_title}>Correct</h1>
                        </div>
                        <div className={styles.individual_stat}>
                            <h1 className={styles.individual_stat_num}>{reportData?.incorrect}</h1>
                            <h1 className={styles.individual_stat_title}>Incorrect</h1>
                        </div>
                    </div>
                </div>
                <div className={styles.hero_right}>
                    <h1 className={styles.grade_title}>You earned a<br /><span>{gradeFromScore(reportData?.pct)}</span></h1>
                </div>
            </div>

            <div className={styles.struggles_hero}>
                <h1 className={styles.struggles_hero_small_title}>Categories</h1>
                <h1 className={styles.struggles_hero_title}>Checkout your performance in different categories!</h1>
                <div className={styles.struggles}>
                    {reportData?.tags.map((tag: any) => (
                        <div className={styles.struggle} key={tag.tag}>
                            <div className={styles.tag_correct_circle}>
                                <svg viewBox="0 0 42 42" width="100px" height="100px">
                                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="red" strokeWidth="7px" />
                                    <circle className={styles.tag_correct_ring} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="green" strokeWidth="3" style={{
                                        strokeDashoffset: 100 - tag.pct,
                                    }} />
                                </svg>
                                <h1 className={styles.tag_grade}>{gradeFromScore(tag.pct)}</h1>
                            </div>
                            <div className={styles.struggle_text}>
                                <h1 className={styles.struggle_title}>{tag.tag}</h1>
                                <p className={styles.struggle_stat}>{tag.correct} Correct, {tag.incorrect} Incorrct</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}