import {useState} from 'react';

export default function App() {
    const [loc, setLoc] = useState(0)

    const handleCodeClick = () => {
      setLoc(prev => prev + 1)
    }

    return (
      <div style={styles.container}>
        <main style={styles.main}>
          <h1 style={styles.title}>CodeForge<span className="cursor">_</span></h1>
          <div style={styles.stats}>
            <p style={{ opacity: 0.7 }}>Lines of Code</p>
            <p style={{opacity: 0.7}}>${Math.floor(loc).toLocaleString()}</p>
            <p style={{ color: 'var(--green)'}}>0 LoC / sec</p>
          </div>

          <button onClick={handleCodeClick} style={styles.codeButton}>
            WRITE CODE
          </button>
        </main>

        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Terminal Upgrades</h3>
          <p style={{ opacity: 0.7 }}>Coming Soon...</p>
        </aside>
      </div>
    )
  }

  const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw'},
    main: {
      flex: 1, display: flex, flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--panel)', borderRight: '1px solid var(--border)'
    },

    title: { fontSize: '3.5rem', color: 'var(--green)', marginBottom: '1rem', textShadow: '0 0 10px rgba(63, 185, 80, 0.4)' },
    stats: { textAlign: 'center', marginBottom: '4rem' },
    counter: { fontSize: '6rem', fontFamily: 'Fira Code, monospace', color: 'var(--cyan)', margin: '1rem 0' },
    bigButton: {
      backgroundColor: 'transparent', border: '2px solid var(--green)', color: 'var(--green)',
      fontSize: '1.5rem', padding: '1.5rem 3rem', borderRadius: '4px',
      boxShadow: 'inset 0 0 10px rgba(63, 185, 80, 02', transition: 'all 0.1s ease',
    },
    sidebar: { width: '400px', padding: '2rem', backgroundColor: '#0f1319'},
    sidebarTitle: { color: 'var(--cyan)', fontSize: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1.5rem'},
  }
}