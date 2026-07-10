import { create } from 'zustand'

export const useStore = create((set) => ({
    loc: 0,
    locPerSec: 0,
    clickPower: 1,

    click: () => set((state) => ({loc: state.loc + state.clickPower})),
    addAutoLoc: (amount) => set((state) => ({loc: state.loc + amount})),
}))