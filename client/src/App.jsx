import { useEffect, useRef } from 'react';
import { useStore } from './store.js'
import UpgradeCard from './UpgradeCard'
import { UPGRADES } from './upgrades'

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

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <h1 style={styles.title}>CodeForge<span className="cursor">_</span></h1>
        <div style={styles.stats}>
          <p style={{opacity: 0.7}}>Lines of Code</p>
          <h2 style={styles.counter}>{Math.floor(loc).toLocaleString()}</h2>
          <p style={{opacity: 0.7}}>Lines of Code per Second: {locPerSec.toFixed(2)}</p>
        </div>
        <button onClick={handleCodeClick} style={styles.bigButton}>Code!</button>
      </main>
    <aside style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>Upgrades</h3>
      <div style={{ overflowY: 'auto', flex:1 }}>
        {UPGRADES.map(upgrade => (
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
  sidebar: { width: '400px', padding: '2rem', backgroundColor: '#0f1319'},
  sidebarTitle: {color: 'var(--cyan)', fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem'}
}