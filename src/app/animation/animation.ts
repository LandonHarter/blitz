export const fade: Animation = {
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

export const dropdown: Animation = {
    initial: {
        opacity: 0,
        scaleY: 0.8,
        transformOrigin: 'top',
    },
    animate: {
        opacity: 1,
        scaleY: 1,
    },
    exit: {
        opacity: 0,
        scaleY: 0.8,
    }
};

export const springScale: Animation = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
    },
    exit: {
        opacity: 0,
        scale: 0.8,
    }
};

export interface Animation {
    initial: any;
    animate: any;
    exit: any;
}