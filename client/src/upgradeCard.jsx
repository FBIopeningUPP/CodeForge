import { useStore } from './store'
import { getUpgradeCost } from './upgrades'

export default function UpgradeCard({ upgrade }) {
    const loc = useStore((state) => state.loc)
    const owned = useStore((state) => state.owned[upgrade.id])
    const buyUpgrade = useStore((state) => state.buyUpgrade)

    const cost = getUpgradeCost(upgrade, owned)
    const canAfford = loc >= cost

    return (
        <div
            onClick={() => canAfford && buyUpgrade(upgrade.id)}
            style={{
                ...StyleSheet.card,
                opacity: canAfford ? 1 : 0.4,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                borderColor: canAfford ? 'var(--green)' : 'var(--border)',
            }}
        >
            <div style={styles.top}>
                <span style={styles.icon}>{upgrade.icon}</span>
                <div>
                    <p style={styles.name}>{upgrade.name}</p>
                    <p style={styles.description}>{upgrade.description}</p>
                </div>
            </div>
            <div style={styles.bottom}>
                <span style={styles.cost}>Cost: {cost.toLocaleString()} LoC</span>
                <span style={styles.owned}>Owned: {owned}</span>
            </div>
            <p style={styles.production}>+{upgrade.baseProduction} LoC/s</p>
        </div>    
    )
}

const styles = {
    card: {
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s ease',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    top: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem',
    },
    icon: { fontSize: '1.5rem' },
    name: {
        color: 'var(--cyan)',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    desc: {
        fontSize: '0.75rem',
        opacity: 0.8,
        fontStyle: 'italic',
    },
    bottom: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
    },
    cost: { coilor: 'var(--green)' },
    owned: { color: 'var(--text)', opacity: 0.7 },
    production: {
        fontSize: '0.7rem',
        opacity: 0.7,
        marginTop: '0.25rem',
    }
}