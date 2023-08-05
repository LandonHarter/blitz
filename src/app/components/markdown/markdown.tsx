'use client'

import styles from './markdown.module.css';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';
import 'cooltipz-css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import React, { useContext } from 'react';
import { getLanguageFromName, getLanguageIcon, getLanguageName } from '@/backend/code';
import DarkModeContext from '@/context/darkmode';

export default function Markdown(props: { text: string, className?: string }) {
    const { get: darkMode } = useContext(DarkModeContext);
    const lightModeTheme = oneLight;
    const darkModeTheme = oneDark;

    return (
        <ReactMarkdown className={`${styles.markdown_content} ${props.className ?? ''}`} components={{
            p: ({ children }) => <p className={styles.blurt_p}>{children}</p>,
            h1: ({ children }) => <h1 className={styles.blurt_h1}>{children}</h1>,
            h2: ({ children }) => <h2 className={styles.blurt_h2}>{children}</h2>,
            h3: ({ children }) => <h3 className={styles.blurt_h3}>{children}</h3>,
            h4: ({ children }) => <h4 className={styles.blurt_h4}>{children}</h4>,
            h5: ({ children }) => <h5 className={styles.blurt_h5}>{children}</h5>,
            h6: ({ children }) => <h6 className={styles.blurt_h6}>{children}</h6>,
            li: ({ children }) => <li className={styles.blurt_li}>{children}</li>,
            ul: ({ children }) => <ul className={styles.blurt_ul}>{children}</ul>,
            ol: ({ children }) => <ol className={styles.blurt_ol}>{children}</ol>,
            span: ({ children }) => <span className={styles.blurt_span}>{children[0]}</span>,
            img: ({ src }) => <><img className={styles.blurt_img} src={src} /><br /></>,
            a: ({ children, href }) => <a className={styles.blurt_a} href={href} target="_blank">{children}</a>,
            code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const matchFinal = match ? match[1] : 'txt';
                const languageName = getLanguageName(matchFinal);

                const Highlighter = () => {
                    return (
                        // @ts-ignore
                        <SyntaxHighlighter style={darkMode ? darkModeTheme : lightModeTheme} customStyle={{
                            width: 'calc(100% - 40px)',
                            backgroundColor: 'var(--bg-dark)',
                            border: 'solid 3px var(--bg-darker)',
                            borderRadius: '0px !important'
                        }} language={getLanguageFromName(matchFinal)} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    );
                }
                return (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 30
                    }}>
                        <div className={styles.language}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <img src={getLanguageIcon(matchFinal)} className={styles.language_icon} />
                                <h2>{languageName}</h2>
                            </div>
                            <div className={styles.border_cover} />
                        </div>
                        <div className={styles.code_container}>
                            <Highlighter />
                        </div>
                    </div>
                );
            },
            br: () => <><br /><br /></>,
        }} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{props.text}</ReactMarkdown>
    );
}