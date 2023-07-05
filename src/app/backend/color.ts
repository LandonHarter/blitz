export const userColors = [
    {
        name: 'red',
        hex: '#cc0000'
    },
    {
        name: 'blue',
        hex: '#0000cc'
    },
    {
        name: 'green',
        hex: '#009900'
    },
    {
        name: 'purple',
        hex: '#660066'
    },
    {
        name: 'orange',
        hex: '#ff6600'
    },
    {
        name: 'pink',
        hex: '#cc00cc'
    }
];

export const getRandomColor = () => {
    return userColors[Math.floor(Math.random() * userColors.length)];
}

export const colorFromName = (name:string) => {
    return userColors.find(c => c.name === name);
}