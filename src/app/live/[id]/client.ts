import { User } from "@/backend/firebase/user";
import { Unsubscribe, get, ref } from "firebase/database";
import { realtimeDb } from "@baas/init";
import { leaveGame } from "@/backend/live/game";

export const initClient = async (gameId: string, currentUser: User) => {
    const gameRef = ref(realtimeDb, `live-games/${gameId}/users/${currentUser.uid}`);
    if (!(await get(ref(realtimeDb, `live-games/${gameId}`))).exists()) {
        return {
            userInGame: false,
            error: true,
        }
    }

    const snapshot = await get(gameRef);
    const userInGame = snapshot.exists();

    return {
        userInGame,
        error: false,
    }
}

export const unloadCallback = (gameId: string, currentUser: User, unsubscribeEvent: Unsubscribe, unsubscribeNewPlayer: Unsubscribe, unsubscribeLeavePlayer: Unsubscribe) => {
    return async () => {
        unsubscribeEvent();
        unsubscribeNewPlayer();
        unsubscribeLeavePlayer();

        await leaveGame(gameId, currentUser);
    };
};