export interface Report {

    tags: {
        tag: string;
        pct: number;
        correct: number;
        incorrect: number;
    }[],
    pct: number;
    correct: number;
    incorrect: number;

}

const sessions: {
    [name: string]: {
        submission: string;
        tags: string[],
        correct: boolean;
    }[]
} = {};

export const createSession = (name: string) => {
    sessions[name] = [];
}

export const reportSubmission = (session: string, submission: string, tags: string[], correct: boolean) => {
    sessions[session].push({
        submission,
        tags,
        correct
    });
};

export const clearSession = (session: string) => {
    sessions[session].length = 0;
};

export const analyzeSession = (session: string): Report => {
    const tagDictionary: {
        [tag: string]: {
            submission: string;
            correct: boolean;
        }[]
    } = {};

    sessions[session].forEach(({ submission, tags, correct }) => {
        tags.forEach(tag => {
            if (!tagDictionary[tag]) {
                tagDictionary[tag] = [];
            }

            tagDictionary[tag].push({
                submission,
                correct
            });
        });
    });

    const tagsReport: {
        tag: string;
        pct: number;
        correct: number;
        incorrect: number;
    }[] = [];
    for (const tag in tagDictionary) {
        const correct = tagDictionary[tag].filter(({ correct }) => correct).length;
        const incorrect = tagDictionary[tag].filter(({ correct }) => !correct).length;
        const pct = +((correct / (correct + incorrect) * 100).toFixed(2));
        tagsReport.push({
            tag,
            pct,
            correct,
            incorrect
        });
    }
    tagsReport.sort((a, b) => a.pct - b.pct);

    let totalCorrect = 0;
    let totalIncorrect = 0;
    sessions[session].forEach(({ correct }) => {
        if (correct) {
            totalCorrect++;
        } else {
            totalIncorrect++;
        }
    });
    const totalPct = totalCorrect / (totalCorrect + totalIncorrect) * 100;

    return {
        tags: tagsReport,
        pct: +totalPct.toFixed(2),
        correct: totalCorrect,
        incorrect: totalIncorrect
    };
};

export const getLink = (session: string, gameType: string) => {
    return `/analyze?reportData=${JSON.stringify(analyzeSession(session))}&game=${gameType}`;
};