import { collection, doc, getDoc } from "@firebase/firestore";
import { firestore } from "@baas/init";

export interface User {

    name:string;
    email:string;
    pfp:string;
    uid:string;
    empty:boolean;
    quizzes:string[];

}

export async function getUserData(userId:string) {
    const userRef = doc(collection(firestore, 'users'), userId);
    const userData = await getDoc(userRef);

    if (userData.exists()) {
        const newUser:User = {
            name: userData.data().name,
            email: userData.data().email,
            pfp: userData.data().pfp,
            uid: userData.data().uid,
            empty: false,
            quizzes: userData.data().quizzes,
        };

        return Promise.resolve(newUser);
    } 

    return Promise.reject();
}