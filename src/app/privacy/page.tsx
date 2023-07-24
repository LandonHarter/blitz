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
                <h1 className={styles.small_title}>Privacy Policy</h1>
                <h1 className={styles.big_title}>We care about your privacy.</h1>
                <h3 className={styles.subtitle}>Effective Date: 7/24/2023</h3>

                <div className={styles.privacy}>
                    <p>
                        What information do we collect?
                        <p className={styles.section_content}>
                            When you sign up or contact us, you may give us some information that can identify you, such as your name or email address. We call this “Personal Information” and we may collect it from you voluntarily.
                        </p>
                    </p>
                    <p>
                        How do we use your information?
                        <p className={styles.section_content}>
                            We collect your information to offer you a better experience on our website and services. We use it to customize the content you see, deliver study tools and classroom tools, and answer your questions. We also use it to send you updates, newsletters, and promotional materials about our services, but you can always opt-out of these communications if you want. Sometimes, we may need your information to help you with support or feedback requests. Other times, we may use your information in an anonymous and aggregated way to see how our website and services are being used and how we can improve them. Don’t worry, this data will not identify you personally.
                        </p>
                    </p>
                    <p>
                        How do we share your information?
                        <p className={styles.section_content}>
                            <p className={styles.section_content}>
                                We may share your information with trusted third-party service providers who assist us in operating our website, providing our services, and conducting our business. These providers are obligated to protect your information and may only use it for the purposes specified by us.
                            </p>
                        </p>
                    </p>
                    <p>
                        How secure is your information?
                        <p className={styles.section_content}>
                            We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </p>
                    <p>
                        Third-Party Websites?!
                        <p className={styles.section_content}>
                            Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites, and we are not responsible for the privacy practices or content of such websites. We encourage you to review the privacy policies of those third-party websites before providing any personal information.
                        </p>
                    </p>
                    <p>
                        What if we change this policy?
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