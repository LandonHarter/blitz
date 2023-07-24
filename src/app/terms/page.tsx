import Footer from '@/components/footer/footer';
import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service • Blitz',
    description: 'Terms of Service for Blitz.'
};

export default function TOSPage() {
    return (
        <div>
            <div className={styles.terms_container}>
                <h1 className={styles.small_title}>Terms of Service</h1>
                <h1 className={styles.big_title}>By accessing our services, you agree to these terms. Follow the rules!</h1>
                <h3 className={styles.subtitle}>Effective Date: 7/24/2023</h3>

                <div className={styles.terms}>
                    <p>
                        Acceptance of Terms of Service
                        <p className={styles.section_content}>
                            By accessing or using the Blitz website, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.
                        </p>
                    </p>
                    <p>
                        Description of Service
                        <p className={styles.section_content}>
                            Blitz is an educational platform that provides live games and study tools to enhance your learning experience. The Platform offers various features, including but not limited to, live game hosting, study materials, interactive lessons, and community forums.
                        </p>
                    </p>
                    <p>
                        Registration and Account
                        <p className={styles.section_content}>
                            Blitz is an educational platform that provides live games and study tools to enhance your learning experience. The Platform offers various features, including but not limited to, live game hosting, study materials, interactive lessons, and community forums.
                        </p>
                    </p>
                    <p>
                        User Conduct
                        <p className={styles.section_content}>
                            When using Blitz, you agree to abide by the following guidelines:<br />
                            1. You will not use the Service for any unlawful or unauthorized purposes.<br />
                            2. You will not transmit any viruses, worms, or any other destructive code.<br />
                            3. You will not interfere with or disrupt the Service or servers or networks connected to the Service.<br />
                            4. You will not engage in any activity that may harm or exploit minors.<br />
                            5. You will not collect or store personal information of other users without their consent.<br />
                            6. You will not impersonate any person or entity or misrepresent your affiliation with any person or entity.<br />
                            7. You will not use the Service in any manner that could disable, overburden, or impair the Service.<br />
                            8. You will not attempt to gain unauthorized access to any part of the Service or its related systems or networks.<br />
                        </p>
                    </p>
                    <p>
                        Intellectual Property Rights
                        <p className={styles.section_content}>
                            Blitz is an educational platform that provides live games and study tools to enhance your learning experience. The Platform offers various features, including but not limited to, live game hosting, study materials, interactive lessons, and community forums.
                        </p>
                    </p>
                    <p>
                        Privacy
                        <p className={styles.section_content}>
                            Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and disclose personal information.
                        </p>
                    </p>
                    <p>
                        Third Party Content
                        <p className={styles.section_content}>
                            The Service may contain links to third-party websites or resources that are not owned or controlled by Blitz. Blitz does not endorse or assume any responsibility for the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that Blitz shall not be liable for any damages or losses arising from your use of any third-party websites.
                        </p>
                    </p>
                    <p>
                        Limitation and Liability
                        <p className={styles.section_content}>
                            To the maximum extent permitted by law, Blitz and its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses, arising out of or in connection with your use of the Service.
                        </p>
                    </p>
                    <p>
                        Termination
                        <p className={styles.section_content}>
                            Blitz reserves the right to suspend, terminate, or restrict your access to the Service at any time, with or without cause, and without prior notice or liability. Upon termination, all licenses and rights granted to you under these Terms will immediately cease, and you must cease all use of the Service.
                        </p>
                    </p>
                    <p>
                        Modifications to the Service
                        <p className={styles.section_content}>
                            Blitz reserves the right to modify, suspend, or discontinue the Service at any time without prior notice or liability. We may also impose limits on certain features and services or restrict your access to parts or all of the Service without notice or liability.
                        </p>
                    </p>
                    <p>
                        Changes to the Terms of Service
                        <p className={styles.section_content}>
                            Blitz may revise these Terms from time to time, and any changes will be effective upon posting the updated Terms on the Blitz website. It is your responsibility to review these Terms periodically. Your continued use of the Service after any modifications signifies your acceptance of the revised Terms.
                        </p>
                    </p>
                    <p>
                        Entire Agreement
                        <p className={styles.section_content}>
                            hese Terms constitute the entire agreement between you and Blitz regarding the use of the Service and supersede any prior or contemporaneous agreements, communications, and proposals, whether oral or written, between you and Blitz.
                        </p>
                    </p>
                    <p>
                        Contact Information
                        <p className={styles.section_content}>
                            If you have any questions or concerns regarding these Terms, please contact me at landonharter@outlook.com
                        </p>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}