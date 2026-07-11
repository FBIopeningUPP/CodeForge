import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UPGRADES, getUpgradeCost } from './upgrades'
import { RESEARCH } from './research'

export const useStore = create(
    persist(
        (set, get) => ({
            unlockedAchievements: [],
            loc: 0,
            locPerSec: 0,
            clickPower: 1,
            lifetimeLoc: 0,
            refactorTokens: 0,
            unlockedResearch: [],
            totalClicks: 0,
            boostActive: false,
            lastSaveTime: Date.now(),

            owned: Object.fromEntries(UPGRADES.map(u => [u.id, 0])),

            click: () => set((state) => {
                const tokenPower = state.unlockedResearch.includes('better_math') ? 0.2 : 0.1
                const bugMultiplier = state.boostActive ? (state.unlockedResearch.includes('golden_age') ? 5 : 2) : 1
                const multiplier = (1 + (state.refactorTokens * tokenPower)) * bugMultiplier
                const clickBase = state.clickPower + (state.unlockedResearch.includes('heavy_fingers') ? (state.locPerSec * 0.05) : 0)
                const earned = clickBase * multiplier
                return { loc: state.loc + earned, lifetimeLoc: state.lifetimeLoc + earned, totalClicks: (state.totalClicks || 0) + 1 }
            }),

            addAutoLoc: (amount) => set((state) => {
                const tokenPower = state.unlockedResearch.includes('better_math') ? 0.2 : 0.1
                const bugMultiplier = state.boostActive ? (state.unlockedResearch.includes('golden_age') ? 5 : 2) : 1
                const multiplier = (1 + (state.refactorTokens * tokenPower)) * bugMultiplier
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

            triggerBoost: () => {
                set({ boostActive: true })
                setTimeout(() => {
                    set({ boostActive: false })
                }, 30000) 
            },

            buyResearch: (id) => set((state) => {
                const node = RESEARCH.find(r => r.id === id)
                if (!node || state.unlockedResearch.includes(id) || state.refactorTokens < node.cost) return state;

                return {
                    refactorTokens: state.refactorTokens - node.cost,
                    unlockedResearch: [...state.unlockedResearch, id]
                }
            }),

            wipeSave: () => set({
                loc: 0,
                locPerSec: 0,
                refactorTokens: 0,
                lifetimeLoc: 0,
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