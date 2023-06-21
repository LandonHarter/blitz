import { firestore, realtimeDb } from "@baas/init";
import { get, onChildAdded, onChildRemoved, onValue, ref, remove, set, update } from "firebase/database";
import { User } from "@baas/user";
import { GameUser } from "./user";
import generateId from "@backend/id";
import { EventType } from "@backend/live/events/event";
import { AnalyticsEventType, pushAnalyticsEvent } from "../firebase/analytics";
import { collection, getDoc, doc } from "firebase/firestore";

export const createGame = async (hostId:string) => {
    const setId = '7LhuCJXQTMyjWvbyo6gp';
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
        started: false,
    });
    await pushAnalyticsEvent({
        type: AnalyticsEventType.CreateGame,
        data: {},
    });

    return {
        success: true,
        error: '',
        gameCode: gameCode,
    };
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
    const gameRef = ref(realtimeDb, `live-games/${gameCode}/events/`);

    onChildAdded(gameRef, (snapshot) => {
        gameEvents({
            eventType: EventType[snapshot.val().eventType as keyof typeof EventType],
            eventData: snapshot.val().eventData,
        });
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

export const getGameData = async (gameCode:string) => {
    const gameRef = ref(realtimeDb, `live-games/${gameCode}/`);
    const gameSnapshot = await get(gameRef);
    const gameData = gameSnapshot.val();

    const data:GameData = {
        host: gameData.host,
        setId: gameData.gameSetId,
    };

    return data;
};

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

export const pushGameEvent = async (gameCode:string, event:GameEvent) => {
    const eventsRef = ref(realtimeDb, `live-games/${gameCode}/events/${generateId()}`);
    await set(eventsRef, {
        eventType: event.eventType.toString(),
        eventData: event.eventData,
        eventId: event.eventId,
    });
};

export const startGame = async (id:string) => {
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

export const deleteGame = async (id:string) => {
    const gameRef = ref(realtimeDb, `live-games/${id}/`);
    await remove(gameRef);
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateGameCode = () => {
    let gameCode = "";
    for (let i = 0; i < 6; i++) {
        gameCode += letters[Math.floor(Math.random() * letters.length)];
    }
    return gameCode;
};

export interface GameData {
    host:string;
    setId:string;
}

export interface GameEvent {
    eventType:EventType;
    eventData:any;
    eventId:string;
}