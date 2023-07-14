import { auth, firestore } from "@baas/init";
import { randomInt } from "crypto";
import { GithubAuthProvider, GoogleAuthProvider, OAuthProvider, UserCredential, getAdditionalUserInfo, signInWithPopup } from "firebase/auth";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { User, UserProfile } from '@baas/user';
import { getRandomProfileBackground } from "../color";

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(auth, provider);
    if (credentials) {
        return setUserData(credentials);
    }

    return Promise.reject();
};

export const signInWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    const credentials = await signInWithPopup(auth, provider);
    if (credentials) {
        return setUserData(credentials);
    }

    return Promise.reject();
};

export const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    const credentials = await signInWithPopup(auth, provider);
    if (credentials) {
        return setUserData(credentials);
    }

    return Promise.reject();
}

export const signOut = async () => {
    await auth.signOut();

    return Promise.resolve();
};

const setUserData = async (credentials: UserCredential) => {
    const userInfo = await getAdditionalUserInfo(credentials);
    if (userInfo != null && !userInfo.isNewUser) return Promise.reject();

    const user = credentials.user;
    if (user == null) return Promise.reject();

    const userObject: User = {
        name: user.displayName ?? "User" + randomInt(0, 100000),
        email: user.email ?? "",
        pfp: user.photoURL ?? "/images/avatar.png",
        uid: user.uid,
        empty: false,
        sets: [],
        createdAt: Timestamp.now(),
        verified: false,
    };

    const userRef = doc(collection(firestore, 'users'), user.uid);
    await setDoc(userRef, userObject);

    const userProfileObject: UserProfile = {
        bio: "",
        profileBackground: getRandomProfileBackground().name,
    };

    const userProfileRef = doc(collection(firestore, 'users-profile'), user.uid);
    await setDoc(userProfileRef, userProfileObject);

    return Promise.resolve();
};