import { getAnalytics, logEvent } from "firebase/analytics";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "./init";

export const pushAnalyticsEvent = async (event: AnalyticsEvent) => {
    const fba = getAnalytics();
    await logEvent(fba, event.type.toString(), event.data);
};

export interface AnalyticsEvent {
    type: AnalyticsEventType;
    data: any;
}

export enum AnalyticsEventType {

    CreateGame = 'create_game',
    NextError = 'next_error',

}

let metricsCache: {
    numUsers: number;
    numSets: number;
    numGamesPlayed: number;
} | null = null;
export const getMetrics = async () => {
    if (metricsCache) {
        return metricsCache;
    }

    const metricsRef = doc(collection(firestore, 'site'), 'metrics');
    const metricsDoc = await getDoc(metricsRef);
    const metrics = metricsDoc.data();
    metricsCache = {
        numUsers: metrics?.numUsers || 0,
        numSets: metrics?.numSets || 0,
        numGamesPlayed: metrics?.numGamesPlayed || 0,
    };

    return metricsCache;
};