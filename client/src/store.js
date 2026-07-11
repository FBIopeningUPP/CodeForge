import { create } from 'zustand'
import { UPGRADES, getUpgradeCost } from './upgrades'

export const useStore = create((set) => ({
    loc: 0,
    locPerSec: 0,
    clickPower: 1,

    owned: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),

    click: () => set((state) => ({loc: state.loc + state.clickPower})),

    addAutoLoc: (amount) => set((state) => ({loc: state.loc + amount})),

    buyUpgrade: (id) => {
        const state = get()
        const upgrade = UPGRADES.find(u => u.id === id)
        if(!upgrade) return

        const count = state.owned[id]
        const cost = getUpgradeCost(upgrade, count)

        if (state.loc < cost) return

        const newOwned = { ...state.owned, [id]: count + 1 }
        const newLocPerSec = UPGRADES.reduce((total, u) => {
            return total + u.baseProduction * newOwned[u.id]
        }, 0)

        set({
            loc: state.loc - cost,
            owned: newOwned,
            locPerSec: newLocPerSec,
        })
    },
}))