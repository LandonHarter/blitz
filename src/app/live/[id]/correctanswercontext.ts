import { createContext } from 'react';

export const CorrectAnswerContext = createContext<{
    get: any,
    set: any
}>({
    get: undefined,
    set: () => { }
});