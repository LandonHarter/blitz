const preGamePhrases = [
    "Are you ready?",
    "It's go time",
    "Get ready to rumble",
    "Let's get it on",
];
export const getRandomPreGamePhrase = () => {
    return preGamePhrases[Math.floor(Math.random() * preGamePhrases.length)];
}