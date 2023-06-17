import { realtimeDb } from "@baas/init";
import { get, ref, set } from "firebase/database";
import { User } from "@baas/user";

export const createGame = async () => {
    const gameCode = generateGameCode();
    const gameRef = ref(realtimeDb, `live-games/${gameCode}`);

    await set(gameRef, {
        gameQuizId: '',
    });

    return gameCode;
};

export const joinGame = async (gameCode:string, user:User) => {
    const gameRef = ref(realtimeDb, `live-games/${gameCode}`);
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/${user.uid}`);

    const gameSnapshot = await get(gameRef);
    if (!gameSnapshot.exists()) {
        return {
            success: false,
            error: 'Game does not exist',
        };
    }

    const userSnapshot = await get(usersRef);
    if (userSnapshot.exists()) {
        return {
            success: false,
            error: 'User already joined',
        };
    }

    await set(usersRef, {
        uid: user.uid,
        name: user.name,
    });

    return {
        success: true,
        error: '',
    };
};

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateGameCode = () => {
    let gameCode = "";
    for (let i = 0; i < 6; i++) {
        gameCode += letters[Math.floor(Math.random() * letters.length)];
    }
    return gameCode;
};