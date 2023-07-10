import { Timestamp } from "firebase/firestore";

export const formatTimestamp = (timestamp: Timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        const yearsAgo = interval === 1 ? 'year' : 'years';
        return interval + " " + yearsAgo + " ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        const monthsAgo = interval === 1 ? 'month' : 'months';
        return interval + " " + monthsAgo + " ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        const daysAgo = interval === 1 ? 'day' : 'days';
        return interval + " " + daysAgo + " ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        const hoursAgo = interval === 1 ? 'hour' : 'hours';
        return interval + " " + hoursAgo + " ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        const minutesAgo = interval === 1 ? 'minute' : 'minutes';
        return interval + " " + minutesAgo + " ago";
    }

    const secondsAgo = seconds === 1 ? 'second' : 'seconds';
    return seconds + " " + secondsAgo + " ago";
};

export const arrayMove = (arr: any[], oldIndex: number, newIndex: number) => {
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};