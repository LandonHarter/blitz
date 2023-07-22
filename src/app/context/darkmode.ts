import { createContext } from "react";

const DarkModeContext = createContext<{ get: boolean, set: Function }>({
    get: false,
    set: () => { }
});
export default DarkModeContext;