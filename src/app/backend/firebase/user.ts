import { collection, doc, getDoc, Timestamp } from "@firebase/firestore";
import { firestore } from "@baas/init";

export interface User {

    name: string;
    email: string;
    pfp: string;
    uid: string;
    empty: boolean;
    sets: UserSet[];

}

export interface UserSet {

    id: string;
    name: string;
    description: string;
    image: string;
    updatedAt: Timestamp;
}

export async function getUserData(userId: string) {
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
        };

        return Promise.resolve(newUser);
    }

    return Promise.reject();
}