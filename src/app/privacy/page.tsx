import Footer from '@/components/footer/footer';
import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy • Blitz',
    description: 'Blitz prides itself on being a privacy-first company. We do not sell your data to third parties.'
};

export default function PrivacyPage() {
    return (
        <div>
            <div className={styles.privacy_container}>
                <h1 className={styles.title}>Privacy Policy</h1>
                <h3 className={styles.subtitle}>Effective Date: 7/20/2023</h3>
                <div className={styles.divider} />
                <div className={styles.privacy}>
                    <p>
                        1. Information We Collect
                        <p className={styles.section_content}>
                            <p className={styles.section_content}>
                                1.1 Personal Information: We may collect certain personally identifiable information (&quot;Personal Information&quot;) from you when you voluntarily provide it to us. This includes information such as your name, email address, and any other information you provide during the registration process or through support or request channels.
                            </p>
                        </p>
                    </p>
                    <p>
                        2. Use of Information
                        <p className={styles.section_content}>
                            <p className={styles.section_content}>
                                2.1 Providing Services: We use the information we collect to provide, personalize, maintain, and improve our website and services. This includes delivering study tools and classroom tools, customizing content, and responding to your requests.
                            </p>
                            <p className={styles.section_content}>
                                2.2 Communication: We may use your Personal Information to communicate with you about our services, updates, newsletters, and promotional materials. You can opt-out of receiving such communications at any time by following the instructions provided in the communication or by contacting us directly.
                            </p>
                            <p className={styles.section_content}>
                                2.3 Support and Feedback: If you contact us for support or submit feedback, we may collect and process the information provided to assist you and improve our services.
                            </p>
                            <p className={styles.section_content}>
                                2.4 Aggregated Data: We may aggregate and anonymize your information to analyze trends, monitor usage patterns, and improve our website and services. This aggregated data will not personally identify you.
                            </p>
                        </p>
                    </p>
                    <p>
                        3. Disclosure of Information
                        <p className={styles.section_content}>
                            <p className={styles.section_content}>
                                3.1 Service Providers: We may share your information with trusted third-party service providers who assist us in operating our website, providing our services, and conducting our business. These providers are obligated to protect your information and may only use it for the purposes specified by us.
                            </p>
                            <p className={styles.section_content}>
                                3.2 Legal Compliance: We may disclose your information if required by law, court order, or governmental authority, or if we believe that such action is necessary to comply with applicable laws, protect our rights, or investigate fraud or security issues.
                            </p>
                            <p className={styles.section_content}>
                                3.3 Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of the transaction. We will notify you via email and/or prominent notice on our website of any change in ownership or uses of your Personal Information.
                            </p>
                        </p>
                    </p>
                    <p>
                        4. Data Security
                        <p className={styles.section_content}>
                            We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </p>
                    <p>
                        5. Third-Party Websites
                        <p className={styles.section_content}>
                            Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites, and we are not responsible for the privacy practices or content of such websites. We encourage you to review the privacy policies of those third-party websites before providing any personal information.
                        </p>
                    </p>
                    <p>
                        6. Changes to this Policy
                        <p className={styles.section_content}>
                            We may update this Privacy Policy from time to time. Any changes will be effective immediately upon posting the revised Privacy Policy on our website.
                        </p>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}