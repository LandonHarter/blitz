import { Timestamp } from "firebase/firestore";

export const formatTimestampAgo = (timestamp: Timestamp) => {
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

export const formatTimestampDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return month + " " + day + ", " + year;
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

export const formatNumber = (num: number) => {
    if (num < 1000) return num.toString();

    const numStr = num.toString();
    const numStrLen = numStr.length;
    if (numStrLen <= 6) {
        const thousands = numStr.substring(0, numStrLen - 3);
        return thousands + "K+";
    } else if (numStrLen <= 9) {
        const millions = numStr.substring(0, numStrLen - 6);
        return millions + "M+";
    } else if (numStrLen <= 12) {
        const billions = numStr.substring(0, numStrLen - 9);
        return billions + "B+";
    } else if (numStrLen <= 15) {
        const trillions = numStr.substring(0, numStrLen - 12);
        return trillions + "T+";
    }

    return num.toString();
}

export const gradeFromScore = (score: number) => {
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
}