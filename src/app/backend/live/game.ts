import { firestore, realtimeDb } from "@baas/init";
import { get, onChildAdded, onChildRemoved, onValue, ref, remove, set, update } from "firebase/database";
import { User } from "@baas/user";
import { GameUser } from "./user";
import generateId from "@backend/id";
import { EventType } from "@backend/live/events/event";
import { AnalyticsEventType, pushAnalyticsEvent } from "../firebase/analytics";
import { collection, getDoc, doc, updateDoc, increment } from "firebase/firestore";

export const createClassicGame = async (hostId: string, setId: string) => {
    const setData = await getDoc(doc(collection(firestore, 'sets'), setId));
    if (!setData.exists()) {
        return {
            success: false,
            error: 'Set does not exist',
            gameCode: '',
        };
    }

    const publicSet = setData.data().public;
    if (!publicSet) {
        if (setData.data().owner !== hostId) {
            return {
                success: false,
                error: 'Set is not public',
                gameCode: '',
            };
        }
    }

    const gameCode = generateGameCode();
    const gameRef = ref(realtimeDb, `live-games/${gameCode}`);

    await set(gameRef, {
        gameSetId: setId,
        host: hostId,
        gameType: 'classic',
        started: false,
    });
    await pushAnalyticsEvent({
        type: AnalyticsEventType.CreateGame,
        data: {},
    });

    updateDoc(doc(collection(firestore, 'site'), 'metrics'), {
        numGamesPlayed: increment(1),
    });

    return {
        success: true,
        error: '',
        gameCode: gameCode,
    };
};

export const joinGame = async (gameCode: string, user: User) => {
    const formattedGameCode = gameCode.toUpperCase();
    const gameRef = ref(realtimeDb, `live-games/${formattedGameCode}`);
    const usersRef = ref(realtimeDb, `live-games/${formattedGameCode}/users/${user.uid}`);

    const gameSnapshot = await get(gameRef);
    if (!gameSnapshot.exists()) {
        return {
            success: false,
            error: 'Game does not exist',
        };
    } else if (gameSnapshot.val().started) {
        return {
            success: false,
            error: 'Game already started',
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
        pfp: user.pfp,
        email: user.email,
        points: 0,
    });

    return {
        success: true,
        error: '',
        gameType: gameSnapshot.val().gameType,
    };
};

export const leaveGame = async (gameCode: string, user: User) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/${user.uid}`);
    await remove(usersRef);
};

export const subscribeToGame = (gameCode: string, gameEvents: Function, userJoin: Function, userLeave: Function) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const gameRef = ref(realtimeDb, `live-games/${gameCode}/events/`);

    const unsubscribeEvent = onChildAdded(gameRef, (snapshot) => {
        gameEvents({
            eventType: EventType[snapshot.val().eventType as keyof typeof EventType],
            eventData: snapshot.val().eventData,
        });
    });

    const unsubscribeNewPlayer = onChildAdded(usersRef, (snapshot) => {
        userJoin({
            name: snapshot.val().name,
            uid: snapshot.val().uid,
            pfp: snapshot.val().pfp,
            email: snapshot.val().email,
            points: snapshot.val().points,
        });
    });

    const unsubscribeLeavePlayer = onChildRemoved(usersRef, (snapshot) => {
        userLeave({
            name: snapshot.val().name,
            uid: snapshot.val().uid,
            pfp: snapshot.val().pfp,
            email: snapshot.val().email,
            points: snapshot.val().points,
        });
    });

    return { unsubscribeEvent, unsubscribeNewPlayer, unsubscribeLeavePlayer };
}

export const getGameData = async (gameCode: string) => {
    const gameRef = ref(realtimeDb, `live-games/${gameCode}/`);
    const gameSnapshot = await get(gameRef);

    if (!gameSnapshot.exists()) {
        return null;
    }

    const gameData = gameSnapshot.val();
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const usersSnapshot = await get(usersRef);

    const data: GameData = {
        host: gameData.host,
        setId: gameData.gameSetId,
        numPlayers: usersSnapshot.size,
        gameType: gameData.gameType
    };

    return data;
};

export const getUsersInGame = async (gameCode: string) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const usersSnapshot = await get(usersRef);
    const users = usersSnapshot.val();

    const usersArray: GameUser[] = [];
    for (const key in users) {
        usersArray.push({
            name: users[key].name,
            uid: users[key].uid,
            pfp: users[key].pfp,
            email: users[key].email,
            points: users[key].points
        });
    }

    return usersArray;
}

export const getNumUsersInGame = async (gameCode: string) => {
    const usersRef = ref(realtimeDb, `live-games/${gameCode}/users/`);
    const usersSnapshot = await get(usersRef);
    return usersSnapshot.size;
};

export const pushGameEvent = async (gameCode: string, event: GameEvent) => {
    const eventsRef = ref(realtimeDb, `live-games/${gameCode}/events/${generateId()}`);
    await set(eventsRef, {
        eventType: event.eventType.toString(),
        eventData: event.eventData,
        eventId: event.eventId,
    });
};

export const startGame = async (id: string) => {
    const gameRef = ref(realtimeDb, `live-games/${id}/`);
    await update(gameRef, {
        started: true,
    });

    await pushGameEvent(id, {
        eventType: EventType.StartGame,
        eventData: {},
        eventId: generateId(),
    });
};

export const deleteGame = async (id: string) => {
    const gameRef = ref(realtimeDb, `live-games/${id}/`);
    await remove(gameRef);
}

export const kickPlayer = async (gameId: string, gameUser: GameUser) => {
    const usersRef = ref(realtimeDb, `live-games/${gameId}/users/${gameUser.uid}`);
    await remove(usersRef);

    await pushGameEvent(gameId, {
        eventType: EventType.KickPlayer,
        eventData: {
            uid: gameUser.uid,
        },
        eventId: generateId(),
    });
};

export const awardPoints = async (gameId: string, uid: string, points: number) => {
    const usersRef = ref(realtimeDb, `live-games/${gameId}/users/${uid}`);
    const gameUserSnapshot = await get(usersRef);
    if (!gameUserSnapshot.exists()) {
        return;
    }

    const gameUserVal = gameUserSnapshot.val();
    const currentPoints = gameUserVal.points;
    await update(usersRef, {
        points: currentPoints + points,
    });
};

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateGameCode = () => {
    let gameCode = "";
    for (let i = 0; i < 6; i++) {
        gameCode += letters[Math.floor(Math.random() * letters.length)];
    }
    return gameCode;
};

export interface GameData {
    host: string;
    setId: string;
    numPlayers: number;
    gameType: string;
}

export interface GameEvent {
    eventType: EventType;
    eventData: any;
    eventId: string;
}

export enum GameType {

    None = 'none',
    Classic = 'classic',

}