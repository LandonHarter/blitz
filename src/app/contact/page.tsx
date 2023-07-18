'use client'

import Image from 'next/image';
import styles from './page.module.css';
import { useRef, useState } from 'react';
import Footer from '@/components/footer/footer';
import { sendEmail } from '@/backend/firebase/email';
import BasicReturn from '@/components/basic-return/return';

export default function ContactPage() {
    const contactRef = useRef(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [message, setMessage] = useState('');
    const [submittedMessage, setSubmittedMessage] = useState(false);

    if (submittedMessage) {
        return (<BasicReturn text='We are glad to hear from you!' returnLink='/' />)
    }

    return (
        <div>
            <div className={styles.bg_scrolling} />

            <div className={styles.hero}>
                <h1 className={styles.small_title}>Contact Us</h1>
                <h1 className={styles.big_title}>We&apos;d love to hear from you</h1>
                <h1 className={styles.subtitle}>Our friendly team is always here to chat.</h1>

                <div className={styles.contact_methods}>
                    <div className={styles.card}>
                        <div className={styles.card_image}>
                            <div className={styles.card_ring_1} />
                            <div className={styles.card_ring_2} />
                            <Image className={styles.card_image_content} src='/images/icons/email.png' alt='' width={50} height={50} />
                        </div>

                        <h1 className={styles.card_title}>Email</h1>
                        <p className={styles.card_subtitle}>Our friendly team is here to help.</p>
                        <a className={styles.details} target='_blank' href='mailto:lhartercomputerscience@gmail.com'>lhartercomputerscience@gmail.com</a>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.card_image}>
                            <div className={styles.card_ring_1} />
                            <div className={styles.card_ring_2} />
                            <Image className={styles.card_image_content} src='/images/icons/form.png' alt='' width={50} height={50} />
                        </div>

                        <h1 className={styles.card_title}>Contact Form</h1>
                        <p className={styles.card_subtitle}>Reach us directly.</p>
                        <a className={styles.details}><button onClick={() => {
                            if (!contactRef.current) return;
                            // @ts-ignore
                            contactRef.current.scrollIntoView({ behavior: 'smooth' });
                        }}>⇓</button></a>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.card_image}>
                            <div className={styles.card_ring_1} />
                            <div className={styles.card_ring_2} />
                            <Image className={styles.card_image_content} src='/images/icons/phone.png' alt='' width={50} height={50} />
                        </div>

                        <h1 className={styles.card_title}>Phone</h1>
                        <p className={styles.card_subtitle}>Shoot us a quick text.</p>
                        <a className={styles.details} target='_blank'>(269) 569-1186</a>
                    </div>
                </div>
            </div>

            <div className={styles.contact_form} ref={contactRef}>
                <h1 className={styles.contact_form_small_title}>Contact Us</h1>
                <h1 className={styles.contact_form_big_title}>Get in touch</h1>
                <h1 className={styles.contact_form_subtitle}>We&apos;d love to hear from you. Please fill out this form.</h1>

                <div className={styles.form_content}>
                    <div className={styles.name_inputs}>
                        <input className={styles.name_input} placeholder='First name' maxLength={20} onChange={(e) => {
                            setFirstName(e.target.value);
                        }} />
                        <input className={styles.name_input} placeholder='Last name' maxLength={20} onChange={(e) => {
                            setLastName(e.target.value);
                        }} />
                    </div>
                    <input className={styles.email_input} placeholder='Email' maxLength={50} onChange={(e) => {
                        setEmailAddress(e.target.value);
                    }} />
                    <textarea className={styles.message_input} placeholder='Message' onChange={(e) => {
                        setMessage(e.target.value);
                    }} maxLength={300} />
                    <button className={styles.send_message} onClick={() => {
                        sendEmail('landonharter@outlook.com', 'Blitz Contact Form', `First Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${emailAddress}\nMessage: ${message}`);
                        setFirstName('');
                        setLastName('');
                        setEmailAddress('');
                        setMessage('');
                        setSubmittedMessage(true);
                    }}>Send Message</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}