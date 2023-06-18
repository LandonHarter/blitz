import { realtimeDb } from "@baas/init";
import { get, onChildAdded, onChildRemoved, onValue, ref, remove, set } from "firebase/database";
import { User } from "@baas/user";
import { GameUser } from "./user";

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

export const leaveGame = async (gameCode:string, user:User) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/${user.uid}`);

    let i = 0;
    (await get(ref(realtimeDb, `live-games/${gameCode}/users/`))).forEach(() => { i++ });
    await remove(usersRef);
    if (i <= 1) {
        await remove(ref(realtimeDb, `live-games/${gameCode}/`));
    }
};

export const subscribeToGame = (gameCode:string, gameEvents:Function, userJoin:Function, userLeave:Function) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const gameRef = ref(realtimeDb, `live-games/${gameCode}/`);

    onValue(gameRef, (snapshot) => {
        gameEvents(snapshot);
    });

    onChildAdded(usersRef, (snapshot) => {
        userJoin({
            name: snapshot.val().name,
            uid: snapshot.val().uid,
        });
    });

    onChildRemoved(usersRef, (snapshot) => {
        userLeave({
            name: snapshot.val().name,
            uid: snapshot.val().uid,
        });
    });
}

export const getUsersInGame = async (gameCode:string) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const usersSnapshot = await get(usersRef);
    const users = usersSnapshot.val();

    const usersArray:GameUser[] = [];
    for (const key in users) {
        usersArray.push({
            name: users[key].name,
            uid: users[key].uid,
        });
    }

    return usersArray;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateGameCode = () => {
    let gameCode = "";
    for (let i = 0; i < 6; i++) {
        gameCode += letters[Math.floor(Math.random() * letters.length)];
    }
    return gameCode;
};