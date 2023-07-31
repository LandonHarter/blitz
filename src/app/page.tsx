'use client'

import Footer from '@components/footer/footer';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef } from 'react';
import SignInContext from './context/signincontext';
import UserContext from './context/usercontext';
import Image from 'next/image';
import InViewAnimation from './components/inview-animation/InViewAnimation';
import DarkModeContext from './context/darkmode';

export default function Home() {
  const router = useRouter();
  const signInPopup = useContext(SignInContext);
  const { signedIn } = useContext(UserContext);
  const { get: darkMode } = useContext(DarkModeContext);

  const v2Bg = false;
  const ParralaxBackgroundStyles = {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  } as React.CSSProperties;

  const Feature = (props: { title: string, subtitle: string, image: string }) => (
    <div className={styles.feature}>
      <div className={styles.ring_image}>
        <div className={styles.ring_1} />
        <div className={styles.ring_2} />
        <Image className={styles.ring_content} src={props.image} alt='' width={50} height={50} priority={false} />
      </div>
      <h1 className={styles.feature_title}>{props.title}</h1>
      <h1 className={styles.feature_subtitle}>{props.subtitle}</h1>
    </div>
  );

  const Question = (props: { question: string, answer: string }) => (
    <div className={styles.question}>
      <h1 className={styles.question_title}>{props.question}</h1>
      <p className={styles.question_answer}>{props.answer}</p>
    </div>
  );

  return (
    <div className={styles.page}>
      {v2Bg ?
        <div className={styles.background}>
          <div style={{
            ...ParralaxBackgroundStyles,
            backgroundImage: `url('/images/background/Mountain.jpeg')`,
          }} />
        </div> :
        <div className='bg_scrolling' />
      }


      <div className={styles.hero1} style={{
        minHeight: v2Bg ? 'calc(100vh - 134px)' : '50vh',
        marginBottom: v2Bg ? 0 : 50
      }}>
        <div className={styles.hero1_content} style={{
          transform: v2Bg ? 'translateY(-20vh)' : 'translateY(0)'
        }}>
          <h1 className={styles.title} style={{
            color: v2Bg ? '#353535' : 'var(--text-color)'
          }}>Increase study productivity and results</h1>
          <h1 className={styles.subtitle} style={{
            color: v2Bg ? '#353535' : 'var(--text-color-light)'
          }}>A large collection of <span>FREE</span> study tools through games, proven study techniques, and AI assistance.</h1>
          <div className={styles.hero1_buttons}>
            <button className={styles.get_started} onClick={() => {
              if (signedIn) {
                router.push('/explore/sets');
              } else {
                signInPopup.set(true);
              }
            }}>Get Started</button>
            <Link href='/about'><button className={styles.learn_more}>Learn More</button></Link>
          </div>
        </div>
      </div>

      {v2Bg && <div className={styles.hero_gradient} />}

      <div className={`${styles.device} ${styles.desktop}`}>
        <Image src={`/ss${darkMode ? '-dark' : ''}.webp`} alt='computer' width={1280} height={720} className={styles.computer_screen} />
      </div>

      <div className={styles.computer_screen_coverup} />

      <InViewAnimation className={styles.hero2}>
        <h1 className={styles.hero2_small_title}>Benefits</h1>
        <h1 className={styles.hero2_big_title}>Available tools to boost your study experience</h1>
        <h1 className={styles.hero2_subtitle}>Use a large amount of educational tools, completely free, forever.</h1>

        <div className={styles.hero2_features}>
          <Feature title='Flashcards' subtitle='Create flashcards and share them with all of your friends.' image='/images/icons/primary/flashcards.png' />
          <Feature title='Games' subtitle='Play interactive games to build memory and recall.' image='/images/icons/primary/games.png' />
          <Feature title='AI' subtitle='Use AI assisted tools to boost productivity and learn faster.' image='/images/icons/primary/robot.png' />
          <Feature title='Live' subtitle='Host live games for students or friends to join.' image='/images/icons/primary/live.png' />
          <Feature title='Proven Techniques' subtitle='Use proven study techniques to boost your results.' image='/images/icons/primary/brain.png' />
          <Feature title='Community' subtitle='Join a community of students and teachers to share your knowledge.' image='/images/icons/primary/social.png' />
        </div>
      </InViewAnimation>
      <InViewAnimation className={styles.hero3}>
        <h1 className={styles.hero3_big_title}>FAQ</h1>
        <h1 className={styles.hero3_subtitle}>Here is a little help if you are new 😊</h1>

        <div className={styles.hero3_questions}>
          <Question question='How much do all tools cost?' answer='All services offered by Blitz are free of charge. Good education and curiosity should not be limited by a paywall. Blitz will stay free forever, run by donations and sponsors.' />
          <Question question='How can I study or host a live game?' answer='After finding a set on the explore page, someones profile, or in on your my-sets page, you can click on the title of the set to view its webpage. On the left side of the screen, there is a side panel with many controls including hosting a live game with a set, or the option to study the set.' />
        </div>
      </InViewAnimation>

      <div style={{ marginBottom: 100 }} />

      <Footer />
    </div>
  );
}