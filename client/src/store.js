import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UPGRADES, getUpgradeCost } from './upgrades'

export const useStore = create(
    persist(
        (set, get) => ({
            unlockedAchievements: [],
            loc: 0,
            locPerSec: 0,
            clickPower: 1,
            lifetimeLoc: 0,
            refactorTokens: 0,
            lastSaveTime: Date.now(),

            owned: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),

            click: () => set((state) => {
                const multiplier = 1 + (state.refactorTokens * 0.1)
                const earned = state.clickPower * multiplier
                return { loc: state.loc + earned, lifetimeLoc: state.lifetimeLoc + earned }
            }),

            addAutoLoc: (amount) => set((state) => {
                const multiplier = 1 + (state.refactorTokens * 0.1)
                const earned = amount * multiplier
                return { loc: state.loc + earned, lifetimeLoc: state.lifetimeLoc + earned }
            }),

            buyUpgrade: (id) => {
                const state = get()
                const upgrade = UPGRADES.find(u => u.id === id)
                if (!upgrade) return

                const count = state.owned[id] || 0
                const cost = getUpgradeCost(upgrade, count)

                if (state.loc < cost) return

                const newOwned = { ...state.owned, [id]: count + 1 }
                const newLocPerSec = UPGRADES.reduce((total, u) => {
                    return total + u.baseProduction * (newOwned[u.id] || 0)
                }, 0)

                set({
                    loc: state.loc - cost,
                    owned: newOwned,
                    locPerSec: newLocPerSec,
                })
            },

            refactor: () => set((state) => {
                if (state.lifetimeLoc < 1000000) return state;

                const earnedTokens = Math.floor(Math.cbrt(state.lifetimeLoc / 1000000));

                return {
                    loc: 0,
                    locPerSec: 0,
                    owned: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),
                    refactorTokens: state.refactorTokens + earnedTokens,
                }
            }),

            wipeSave: () => set({
                loc: 0,
                locPerSec: 0,
                unlockedAchievements: [],
                owned: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),
            }),

            calculateOfflineProgress: () => {
                const state = get()
                const now = Date.now()
                const secondsAway = (now - state.lastSaveTime) / 1000

                if (secondsAway > 5 && state.locPerSec > 0) {
                    const earned = Math.floor(state.locPerSec * secondsAway)
                    set({ loc: state.loc + earned, lastSaveTime: now })
                    return earned
                }

                set({ lastSaveTime: now })
                return 0
            },

            checkAchievements: () => {
                const state = get()
                const newlyUnlocked = []

                import('./achievements').then(({ ACHIEVEMENTS }) => {
                    ACHIEVEMENTS.forEach(ach => {
                        if (!state.unlockedAchievements.includes(ach.id) && ach.condition(state)) {
                            newlyUnlocked.push(ach.id)
                        }
                    })

                    if(newlyUnlocked.length > 0) {
                        set({
                            unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked]
                        })

                        alert(`Achievements Unlocked: ${newlyUnlocked.length} new trophies!`)
                    }
                })
            },

            updateSaveTime: () => set({ lastSaveTime: Date.now() }),
        }),
        {
            name: 'codeforge-save',
        }
    )
)

window.useStore = useStore