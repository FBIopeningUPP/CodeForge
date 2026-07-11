export const UPGRADES = [

    {
        id: 'notepad',
        name: 'Notepad++',
        tier: 1,
        baseCost: 10,
        bastProduction: 0.1,
        description: 'It Highlights syntax lawl',
        icon: '📝',
    },
    {
        id: 'vscode',
        name: 'Visual Studio Code',
        tier: 1,
        baseCost: 50,
        baseProduction: 0.5,
        description: 'Setup crazy amount of extensions and become a tech larp',
        icon: '💻',
    },
    {
        id: 'neovim',
        name: 'Neovim',
        tier: 1,
        baseCost: 200,
        baseProduction: 2,
        description: 'Damn u nerd???',
        icon: '⌨️',
    },
    {
        id: 'emacs',
        name: 'Emacs',
        tier: 1,
        baseCost: 5000,
        baseProduction: 10,
        description: 'Ohh shit not you',
        icon: '🖋️',
    },

    //here we will have the otehr teir the equipment
    {
        id: 'mech_keyboard',
        name: 'Mechanical Keyboard',
        tier: 2,
        baseCost: 5000,
        baseProduction: 30,
        description: 'So u choose the cherry mx blues damn nerd',
        icon: '⌨️',
    },
    {
        id: 'split_keyboard',
        name: 'Split Keyboard',
        tier: 2,
        baseCost: 25000,
        baseProduction: 100,
        description: 'So u handsoldered everything and want to be a nerd',
        icon: '🔧',
    },
    {
        id: 'multi_monitor',
        name: 'Multi Monitor Setup',
        tier: 2,
        baseCost: 100000,
        baseProduction: 500,
        description: 'So u want to be a nerd and have 3 monitors',
        icon: '🖥️',
    },
    {
        id: 'dream_pc',
        name: 'Threadripper 3990X',
        tier: 2,
        baseCost: 1000000,
        baseProduction: 2000,
        description: 'what aalll u are doing with those freaking 64 cores',
        icon: '🖥️',
    }
]

export const getUpgradeCost = (upgrade, owned) => 
    Math.floor(upgrade.baseCost * Math.pow(1.15, owned))