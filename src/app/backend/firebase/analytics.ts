import { analytics } from "@baas/init";
import { getAnalytics, logEvent } from "firebase/analytics";

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

}