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

export const colorFromName = (name: string) => {
    return userColors.find(c => c.name === name);
}


// create a dictionary of colors
export const profileBackgroundColors = [
    {
        name: 'dusty-grass',
        value: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)'
    },
    {
        name: 'kye-mesh',
        value: 'linear-gradient(to right, #8360c3, #2ebf91)'
    },
    {
        name: 'relaxing-red',
        value: 'linear-gradient(to right, #fffbd5, #b20a2c)'
    },
    {
        name: 'megatron',
        value: 'linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)'
    },
    {
        name: 'crystalline',
        value: 'linear-gradient(-20deg, #00cdac 0%, #8ddad5 100%)'
    },
];

export const getRandomProfileBackground = () => {
    return profileBackgroundColors[Math.floor(Math.random() * profileBackgroundColors.length)];
}

export const profileBackgroundColorFromName = (name: string) => {
    const res = profileBackgroundColors.find(c => c.name === name);
    if (res) return res.value;

    return profileBackgroundColors[0].value;
}