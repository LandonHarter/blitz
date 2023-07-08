const preGamePhrases = [
    "Are you ready?",
    "It's go time",
    "Get ready to rumble",
    "Let's get it on",
];
export const getRandomPreGamePhrase = () => {
    return preGamePhrases[Math.floor(Math.random() * preGamePhrases.length)];
};

const endGamePhrases = [
    "Good game!",
    "Well played!",
    "What a game!",
    "That was intense!",
    "What an ending!",
    "That was a close one!",
    "That was a nail biter!",
    "Incredible!"
];
export const getRandomEndGamePhrase = () => {
    return endGamePhrases[Math.floor(Math.random() * endGamePhrases.length)];
}
export const getRandomEndGamePhraseSeed = (seed: number) => {
    return endGamePhrases[seed % endGamePhrases.length];
}

const submittedAnswerPhrases = [
    "Nice!",
    "Good one!",
    "Great answer!",
    "That's a good one!",
    "That's a good answer!",
];
export const getRandomSubmittedAnswerPhrase = () => {
    return submittedAnswerPhrases[Math.floor(Math.random() * submittedAnswerPhrases.length)];
}