export const fade:Animation = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    }
};

export interface Animation {
    initial:any;
    animate:any;
    exit:any;
}