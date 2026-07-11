import { useStore } from './store'
import { useEffect, useState } from 'react'

export default function ServerRack() {
    const locPerSec = useStore((state) => state.locPerSec)
    const [blink, setBlink] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(b => !b)
        }, 800)
        return () => clearInterval(interval)
    }, [])

    const serverCount = Math.min(24, Math.floor(locPerSec / 50))

    if (serverCount === 0) return null

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Server Rack</h4>
            <div style={styles.rack}>
                {[...Array(24)].map((_, i) => {
                    const isActive = i < serverCount
                    return (
                        <div key={i} style={{
                            ...styles.server,
                            borderColor: isActive ? 'var(--cyan)' : 'var(--border)',
                            backgroundColor: isActive ? 'rgba(88, 166, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                            opacity: isActive ? 1 : 0.3,
                        }}>
                            <div style={{display: 'flex', gap: '4px'}}>
                                <div style={{...styles.led, backgroundColor: isActive ? (blink ? 'var(--green)' : '#1f4d29') : '#333'}} />
                                <div style={{...styles.led, backgroundColor: isActive ? (!blink ? 'var(--cyan)' : '#1a4b66') : '#333'}} />
                            </div>
                            <div style={styles.vent}></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    container: {
        position: 'absolute',
        left: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '120px',
        backgroundColor: '#0a0d12',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1rem',
        zIndex: 10,
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        color: 'var(--text)',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '1rem',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        opacity: 0.7,
    },
    rack: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
    },
    server: {
        width: '100%',
        height: '16px',
        border: '1px solid',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6px',
        transition: 'all 0.5s ease',
    },
    led: {
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        transition: 'background-color 0.2s ease',
    },
    vent: {
        width: '20px',
        height: '2px',
        backgroundColor: 'rgba(255,255,255,0.1)',
    }
}