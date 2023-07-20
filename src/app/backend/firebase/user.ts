import { collection, doc, getDoc, Timestamp } from "@firebase/firestore";
import { firestore } from "@baas/init";

export interface User {

    name: string;
    email: string;
    pfp: string;
    uid: string;
    empty: boolean;
    sets: UserSet[];
    createdAt?: Timestamp;
    verified?: boolean;
    likedSets?: string[];

}

export interface UserProfile {

    bio: string;
    profileBackground: string;

}

export interface UserSet {

    id: string;
    name: string;
    description: string;
    image: string;
    updatedAt: Timestamp;

}

const userCache: { [key: string]: User } = {};
export async function getUserData(userId: string) {
    if (userCache[userId]) {
        return Promise.resolve(userCache[userId]);
    }

    const userRef = doc(collection(firestore, 'users'), userId);
    const userData = await getDoc(userRef);

    if (userData.exists()) {
        const newUser: User = {
            name: userData.data().name,
            email: userData.data().email,
            pfp: userData.data().pfp,
            uid: userData.data().uid,
            empty: false,
            sets: userData.data().sets,
            likedSets: userData.data().likedSets,
            createdAt: userData.data().createdAt,
            verified: userData.data().verified
        };
        userCache[userId] = newUser;
        return Promise.resolve(newUser);
    }

    return null;
}

export async function getUserProfileData(userId: string) {
    const userRef = doc(collection(firestore, 'users-profile'), userId);
    const userData = await getDoc(userRef);

    if (userData.exists()) {
        const newUser: UserProfile = {
            bio: userData.data().bio,
            profileBackground: userData.data().profileBackground
        };

        return Promise.resolve(newUser);
    }

    return Promise.reject();
}