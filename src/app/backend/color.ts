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
    {
        name: 'lawrencium',
        value: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
    },
    {
        name: 'ohhappiness',
        value: 'linear-gradient(to right, #00b09b, #96c93d)'
    },
    {
        name: 'the-strain',
        value: 'linear-gradient(to right, #870000, #190a05)'
    },
    {
        name: 'pink-fish',
        value: 'linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))'
    },
    {
        name: 'sea-lord',
        value: 'linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1%)'
    },
    {
        name: 'cherry-blossom',
        value: 'linear-gradient(25deg, #d64cc7f2, #ee609cf2 50%)'
    },
    {
        name: 'fresh-air',
        value: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64%)'
    },
    {
        name: 'stellar',
        value: 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64%)'
    },
    {
        name: 'deep-sea-space',
        value: 'linear-gradient(to right, #2c3e50, #4ca1af)'
    },
    {
        name: 'royal',
        value: 'linear-gradient(to right, #141e30, #243b55)'
    },
    {
        name: 'orange-coral',
        value: 'linear-gradient(to right, #ff9966, #ff5e62)'
    },
    {
        name: 'old-wine',
        value: 'linear-gradient(to right, #33001b, #ff0084)'
    },
    {
        name: 'morning-sky',
        value: 'linear-gradient(to right, #b6fbff, #83a4d4)'
    },
    {
        name: 'dusk',
        value: 'linear-gradient(to right, #9796f0, #fbc7d4)'
    }
];

export const getRandomProfileBackground = () => {
    return profileBackgroundColors[Math.floor(Math.random() * profileBackgroundColors.length)];
}

export const profileBackgroundColorFromName = (name: string) => {
    const res = profileBackgroundColors.find(c => c.name === name);
    if (res) return res.value;

    return profileBackgroundColors[0].value;
}