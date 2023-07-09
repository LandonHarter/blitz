import { createContext } from "react";

const SignInContext = createContext<{ get: boolean, set:Function }>({ get: false, set: () => {} });
export default SignInContext;