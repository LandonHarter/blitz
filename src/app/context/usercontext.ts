import { User } from "@/backend/firebase/user";
import { createContext } from "react";

const UserContext = createContext<{ currentUser:User, signedIn:boolean, userLoading:boolean }>({ currentUser: {
    name: "",
    email: "",
    pfp: "/images/avatar.png",
    uid: "",
    empty: true,
    sets: []
}, signedIn: false, userLoading: true });
export default UserContext;