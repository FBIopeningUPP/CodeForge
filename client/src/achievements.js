export const ACHIEVEMENTS = [
    {
        id: 'hello_world',
        name: 'Hello World',
        condition: state => state.loc >= 1,
        flavor: 'Finally u came out of the cave.',
        icon: '🌱'
    },
    {
        id: 'script_kiddie',
        name: 'Script Kiddie',
        condition: state => state.loc >= 100,
        flavor: 'u learnt what for loops are and how to use them.',
        icon: '📜'
    },
    {
        id: 'spaghetti',
        name: 'Spaghetti Code',
        condition: state => state.loc >= 10000,
        flavor: 'howtf this shit works aint no way nobody be touching that',
        icon: '🍝'
    },
    {
        id: 'enterprise',
        name: 'Enterprise Architect',
        condition: state => state.loc >= 1000000,
        flavor: 'whytf they even pay you atp',
        icon: '🏢'
    },
    {
        id: 'delegation',
        name: 'Master Delegator',
        condition: state => state.owned['intern'] >= 1,
        flavor: 'You got urself a intern wow what a headache',
        icon: '🎯'
    },
    {
        id: 'singularity',
        name: 'The singularity',
        condition: state => state.owned['ai_programmer'] >= 1,
        flavor: 'damn these ai programmers.',
        icon: '🤖'
    }
]