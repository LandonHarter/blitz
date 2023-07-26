import { collection, doc, getDoc } from "firebase/firestore";
import { MetadataRoute } from "next";
import { firestore } from "./backend/firebase/init";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [
        {
            url: 'https://blitzedu.vercel.app/',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/about',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/ai',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/ai/summarizer',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/ai/worksheets',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/apply/teacher',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/apply/teacher/requisites',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/contact',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/create',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/explore/sets',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/join',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/privacy',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/terms',
            lastModified: new Date()
        },
        {
            url: 'https://blitzedu.vercel.app/whyus',
            lastModified: new Date()
        },
    ];

    const sitemapData = (await getDoc(doc(collection(firestore, 'site'), 'sitemap'))).data();
    const sets = sitemapData?.sets;
    const users = sitemapData?.users;

    sets.forEach((set: any) => {
        routes.push({
            url: `https://blitzedu.vercel.app/set/${set}`,
            lastModified: new Date()
        });
    });

    users.forEach((user: any) => {
        routes.push({
            url: `https://blitzedu.vercel.app/profile/${user}`,
            lastModified: new Date()
        });
    });

    return routes;
}