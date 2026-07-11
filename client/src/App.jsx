import { useEffect, useRef, useState } from 'react'
import { useStore } from './store.js'
import UpgradeCard from './UpgradeCard'
import { UPGRADES } from './upgrades'
import FloatingText, { FloatingNumbers } from './FloatingText'

export default function App() {
  const loc = useStore((state) => state.loc)

  const locPerSec = useStore((state) => state.locPerSec)
  const handleCodeClick = useStore((state) => state.click)

  const lastTime = useRef(performance.now())

  useEffect(() => {
    let frameId;

    const gameLoop = (time) => {
      const deltaSeconds = (time - lastTime.current) / 1000
      lastTime.current = time

      const currentRate = useStore.getState().locPerSec
      if (currentRate > 0) {
        useStore.getState().addAutoLoc(currentRate * deltaSeconds)
      }

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
          <h2 style={styles.counter}>{Math.floor(loc).toLocaleString()}</h2>
          <p style={{opacity: 0.7}}>Lines of Code per Second: {locPerSec.toFixed(2)}</p>
        </div>
        <button onClick={handleClick} style={styles.bigButton}>Code!</button>
        <FloatingNumbers floats={floats} />
      </main>
    <aside style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>Store</h3>
      <div style={styles.tabContainer}>
        {[1, 2, 3, 4].map(tier => (
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
            Tier {tier}
          </button>
        ))}
      </div>
      <div style={styles.upgradeList}>
        {visibleUpgrades.map(upgrade => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
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
  }
}