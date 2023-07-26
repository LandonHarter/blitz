import { NextResponse } from "next/server";
import { doc, collection, getDoc } from "firebase/firestore";
import { firestore } from "@/backend/firebase/init";

export async function GET(request: Request) {
    const sitemapDataRef = doc(collection(firestore, 'site'), 'sitemap');
    const sitemapData = await getDoc(sitemapDataRef);
    const users = sitemapData.data()?.users;
    const sets = sitemapData.data()?.sets;

    return NextResponse.json({
        users,
        sets
    });
}