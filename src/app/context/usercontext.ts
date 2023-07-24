import { User } from "@/backend/firebase/user";
import { createContext } from "react";

const UserContext = createContext<{ currentUser: User, signedIn: boolean, userLoading: boolean, updateUserData: () => Promise<void> }>({
    currentUser: {
        name: "",
        email: "",
        pfp: "/images/avatar.webp",
        uid: "",
        empty: true,
        sets: []
    }, signedIn: false, userLoading: true, updateUserData: async () => { }
});
export default UserContext;