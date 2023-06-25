'use client'

import { useEffect, useState } from 'react';

import styles from './tabbar.module.css';

export default function TabBar(props:{ children:any, setSelectedTab:Function }) {
    const [tabs, setTabs] = useState<TabData[]>([]);
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        const tabs:TabData[] = [];

        props.children.forEach((child:any) => {
            tabs.push({
                title: child.props.title,
                children: child.props.children
            });
        });

        setTabs(tabs);
    }, [props.children]);

    if (tabs.length < 1) return(<div></div>);

    return(
        <div className={styles.tabbar_container}>
            <div className={styles.tabbar}>
                {tabs.map((tab, index) => {
                    return(
                        <div key={index} className={`${styles.tab} ${index == activeTab && styles.tab_active}`} onClick={() => {
                            setActiveTab(index);
                            props.setSelectedTab(index);
                        }}>
                            <h1>{tab.title}</h1>
                        </div>
                    );
                })}
            </div>

            {tabs[activeTab].children}
        </div>
    );
}

interface TabData {
    title: string,
    children: any
}