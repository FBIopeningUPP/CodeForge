import { useEffect, useRef, useState } from 'react'
import { useStore } from './store.js'
import UpgradeCard from './UpgradeCard'
import { UPGRADES } from './upgrades'
import { ACHIEVEMENTS } from './achievements'
import FloatingText, { FloatingNumbers } from './FloatingText'

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
        {[1, 2, 3, 4, 'Refactor', 'Settings'].map(tier => (
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
    backgroundColor: 'var(--panel)', borderRight: '1px solid var(--border)'
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