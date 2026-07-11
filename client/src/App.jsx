import { useEffect, useRef, useState } from 'react'
import { useStore } from './store.js'
import UpgradeCard from './upgradeCard'
import { UPGRADES } from './upgrades'
import { ACHIEVEMENTS } from './achievements'
import FloatingText, { FloatingNumbers } from './FloatingText'
import MatrixRain from './MatrixRain'
import GoldenBug from './GoldenBug'
import TypingTest from './TypingTest'
import { RESEARCH } from './research'
import ServerRack from './ServerRack'

export default function App() {
  const loc = useStore((state) => state.loc)

  const locPerSec = useStore((state) => state.locPerSec)

  const unlockedAchievements = useStore((state) => state.unlockedAchievements) || []

  const handleCodeClick = useStore((state) => state.click)

  const lastTime = useRef(performance.now())

  const wipeSave = useStore((state) => state.wipeSave)

  const refactorTokens = useStore((state) => state.refactorTokens) || 0
  const lifetimeLoc = useStore((state) => state.lifetimeLoc) || 0
  const triggerRefactor = useStore((state) => state.refactor)

  const unlockedResearch = useStore((state) => state.unlockedResearch) || []
  const buyResearch = useStore((state) => state.buyResearch)

  const totalClicks = useStore((state) => state.totalClicks) || 0;
  const owned = useStore((state) => state.owned) || {};
  const boostActive = useStore((state) => state.boostActive) || false;
  
  useEffect(() => {
    let frameId;

    const gameLoop = (time) => {
      const deltaSeconds = (time - lastTime.current) / 1000
      lastTime.current = time

      const currentRate = useStore.getState().locPerSec
      if (currentRate > 0) {
        useStore.getState().addAutoLoc(currentRate * deltaSeconds)
      }

      useStore.getState().updateSaveTime()
      useStore.getState().checkAchievements()
      frameId = requestAnimationFrame(gameLoop)
    }

    frameId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    const earned = useStore.getState().calculateOfflineProgress()
    if (earned > 0) {
      alert(`Welcome back!`)
    }
  }, [])

  const mainRef = useRef(null)
  const clickPower = useStore((state) => state.clickPower)
  const { spawn, floats} = FloatingText({ clickPower, containerRef: mainRef })

  const handleClick = (e) => {
    handleCodeClick()
    spawn(e)
  }

  const [activeTier, setActiveTier] = useState(1)
  const visibleUpgrades = UPGRADES.filter(upgrade => upgrade.tier === activeTier)

  return (
    <div style={styles.container}>
      <MatrixRain />
      <GoldenBug />
      <TypingTest />
      <ServerRack />
      <main style={{ ...styles.main, position: 'relative' }} ref={mainRef}>
        <h1 style={styles.title}>CodeForge<span className="cursor">_</span></h1>
        <div style={styles.stats}>
          <p style={{opacity: 0.7}}>Lines of Code</p>
          <h2 style={styles.counter}>
              {loc.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
          </h2>          
          <p style={{opacity: 0.7}}>Lines of Code per Second: {locPerSec.toFixed(2)}</p>
        </div>
        <button onClick={handleClick} style={styles.bigButton}>Code!</button>
        <FloatingNumbers floats={floats} />
        <div style={styles.trophyCase}>
          <h4 style={styles.trophyTitle}>Unlocked Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</h4>
          <div style={styles.trophyGrid}>
            {unlockedAchievements.map(id => {
              const ach = ACHIEVEMENTS.find(a => a.id === id)
              if (!ach) return null
              return(
                <div key={ach.id} style={styles.trophy} title={ach.flavor}>
                  <span style={styles.trophyIcon}>{ach.icon}</span>
                  <span style={styles.trophyName}>{ach.name}</span>
                </div>
              )
            })}
        </div>
      </div>
      </main>
    <aside style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>Store</h3>
      <div style={styles.tabContainer}>
        {[1, 2, 3, 4, 'Refactor', 'Research', 'Stats', 'Settings'].map(tier => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            style={{
              ...styles.tabButton,
              backgroundColor: activeTier === tier ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
              borderColor: activeTier === tier ? 'var(--cyan)' : 'var(--border)',
              color: activeTier === tier ? 'var(--cyan)' : 'var(--text)',
              opacity: activeTier === tier ? 1 : 0.7,
            }}
          >
            {typeof tier === 'number' ? `Tier ${tier}` : '⚙️'}
          </button>
        ))}
      </div>
      {}
      {activeTier === 'Settings' ? (
        <div style={styles.settingsPanel}>
          <h4 style={{color: 'var(--text)', marginBottom: '1rem', fontFamily: '"Share Tech Mono", monospace'}}>Settings</h4>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to wipe your save? This cannot be undone.')) {
                wipeSave()
              }
            }}
            style={styles.dangerButton}
          >
            Wipe Save
          </button>
        </div> //yay
      ) : activeTier === 'Research' ? (
        <div style={{ ...styles.settingsPanel, padding: '0 1rem', overflowY: 'auto' }}>
          <h4 style={{ color: 'var(--cyan)', marginBottom: '1rem', marginTop: '1rem', fontFamily: '"Share Tech Mono", monospace', fontSize: '1.5rem'}}>Tech Tree</h4>
          <p style={{ color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Tokens Available: <strong style={{color: 'var(--green)'}}>{refactorTokens}</strong>
          </p>

          <div style={{ width: '100%' }}>
                {RESEARCH.map(node => {
                  const isUnlocked = unlockedResearch.includes(node.id);
                  const canAfford = refactorTokens >= node.cost && !isUnlocked;

                  return (
                    <div key={node.id} style={{
                        border: '1px solid',
                        borderColor: isUnlocked ? 'var(--green)' : (canAfford ? 'var(--cyan)' : 'var(--border)'),
                        borderRadius: '4px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        opacity: isUnlocked ? 0.6 : (canAfford ? 1 : 0.4),
                        cursor: canAfford ? 'pointer' : 'default',
                        backgroundColor: isUnlocked ? 'rgba(63, 185, 80, 0.05)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => { if(canAfford) buyResearch(node.id) }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.8rem' }}>{node.icon}</span>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ color: isUnlocked ? 'var(--green)' : 'var(--cyan)', fontWeight: 'bold', fontSize: '1.1rem' }}>{node.name}</p>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8, fontStyle: 'italic', marginTop: '0.2rem' }}>{node.description}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold', color: isUnlocked ? 'var(--green)' : 'var(--text)' }}>
                            {isUnlocked ? '✓ UNLOCKED' : `Cost: ${node.cost} Tokens`}
                        </div>
                    </div>
                  )
                })}
              </div>
            </div>
      ) : activeTier === 'Refactor' ? (
        <div style={styles.settingsPanel}>
          <h4 style={{ color: 'var(--text)', marginBottom: '1.5rem', fontFamily: '"Share Tech Mono", monospace' }}>Refactor Codebase</h4>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--cyan)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              Refactor Tokens: <strong>{refactorTokens}</strong>
            </p>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              Permanent Multiplier: <strong style={{ color: 'var(--green)' }}>+{(refactorTokens * 10).toFixed(0)}%</strong>
            </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem', width: '100%',textAlign: 'center', border: '1px solid var(--border)' }}>
          <p style={{ opacity: 0.8, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Lifetime Lines of Code:</p>
          <p style={{ color: 'var(--text)', fontSize: '1.2rem', fontFamily: '"Fira Code", monospace' }}>{Math.floor(lifetimeLoc).toLocaleString()}</p>
          <p style={{ opacity: 0.8, fontSize: '0.8rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Tokens on next Refactor:</p>
          <p style={{ color: 'var(--cyan)', fontSize: '2rem', fontWeight: 'bold' }}>
            +{Math.floor(Math.cbrt(Math.max(0, lifetimeLoc) / 1000000))}
          </p>
        </div>
      <button
        onClick={() => {
          if (lifetimeLoc < 1000000) {
            alert("You need at least 1,000,000 Lifetime LoC to Refactor!")
              } else if (window.confirm('Are you sure you want to Refactor? This will wipe your current LoC and Upgrades for permanent tokens.')) {
                triggerRefactor()
              }
            }}
            style={{ ...styles.dangerButton, borderColor: 'var(--cyan)', color: 'var(--cyan)', backgroundColor: 'rgba(88, 166, 255, 0.1)' }}
          >
            INITIATE REFACTOR
          </button>
        </div>
      ) : activeTier === 'Stats' ? (
            <div style={{ ...styles.settingsPanel, padding: '0 1rem' }}>
              <h4 style={{ color: 'var(--cyan)', marginBottom: '2rem', marginTop: '1rem', fontFamily: '"Share Tech Mono", monospace', fontSize: '1.5rem'}}>Statistics</h4>
              <div style={{ width: '100%', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '4px', border:'1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem' }}>
                <p style={{ color: 'var(--text)' }}>Lifetime LoC:
                  <strong style={{color: 'var(--green)', float: 'right', fontFamily: '"Fira Code", monospace'}}>{Math.floor(lifetimeLoc).toLocaleString()}</strong>
                </p>
                <p style={{ color: 'var(--text)' }}>Total Clicks:
                  <strong style={{color: 'var(--cyan)', float: 'right', fontFamily: '"Fira Code", monospace'}}>{totalClicks.toLocaleString()}</strong>
                </p>
                <p style={{ color: 'var(--text)' }}>Achievements:
                  <strong style={{color: '#ffea00', float: 'right', fontFamily: '"Fira Code", monospace'}}>{unlockedAchievements.length} / {ACHIEVEMENTS.length}</strong>
                </p>
                <p style={{ color: 'var(--text)' }}>Upgrades Owned:
                  <strong style={{color: 'var(--text)', float: 'right', fontFamily: '"Fira Code", monospace'}}>{Object.values(owned).reduce((a,b)=>a+b,0)}</strong>
                </p>
                <p style={{ color: 'var(--text)' }}>Current Multiplier:
                  <strong style={{color: '#ff4444', float: 'right', fontFamily: '"Fira Code", monospace'}}>
                    {((1 + (refactorTokens * (unlockedResearch.includes('better_math') ? 0.2 : 0.1))) * (boostActive ? (unlockedResearch.includes('golden_age') ? 5 : 2) : 1)).toFixed(2)}x
                  </strong>
                </p>
              </div>
            </div>
      ) : (
        <div style={styles.upgradeList}>
          {visibleUpgrades.map(upgrade => (
            <UpgradeCard key={upgrade.id} upgrade={upgrade} />
          ))}
        </div>
      )}
    </aside>
    </div>
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw'},
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(22, 27, 34, 0.75)', borderRight: '1px solid var(--border)', zIndex: 1
  },
  title: {fontSize: '3.5rem', color: 'var(--green)', marginBottom: '3rem', textShadow: '0 0 10px rgba(63, 185, 80, 0.4)'},
  stats: {textAlign: 'center', marginBottom: '4rem'},
  counter: {fontSize: '6rem', fontFamily: '"Fira Code", monospace', color: 'var(--cyan)', margin: '1rem 0'},
  bigButton: {
    backgroundColor: 'transparent', border: '2px solid var(--green)', color: 'var(--green)',
    fontSize: '1.5rem', padding: '1.5rem 3rem', borderRadius: '4px',
    boxShadow: 'inset 0 0 10px rgba(63, 185, 80, 0.2)',
  },
  sidebar: {
    width: '450px',
    backgroundColor: '#0f1319',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '2rem 1.5rem',
  },
  sidebarTitle: {
    color: 'var(--cyan)', fontSize: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem', marginBottom: '1rem',
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  tabButton: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    cursor: 'pointer',
    transaction: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontFamily: '"Share Tech Mono", monospace',
  },
  upgradeList: {
  flex: 1,
  overflowY: 'auto',
  paddingRight: '0.5rem',
  },
  trophyCase: {
    marginTop: '4rem',
    width: '80%',
    maxWidth: '600px',
    borderTop: '1px solid var(--border)',
    paddingTop: '1rem',
  },
  trophyTitle: {
    color: 'var(--cyan)',
    textAlign: 'center',
    marginBottom: '1rem',
    fontFamily: '"Share Tech Mono", monospace',
  },
  trophyGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  trophy: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    fontSize: '0.9rem',
    cursor: 'default',
  },
  trophyIcon: { fontSize: '1.5rem' },
  trophyName: { color: 'var(--text)'},

  settingsPanel: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: 'var(--red)',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '1rem 2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: '"Fira Code", monospace',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
}