import { useState, useEffect } from 'react';
import { useStore } from './store';

export default function CoffeeMachine() {
    const triggerBoost = useStore(state => state.triggerBoost);
    const boostActive = useStore(state => state.boostActive);

    const [lastCoffee, setLastCoffee] = useState(
        Number(localStorage.getItem('lastCoffeeTime')) || 0
    );

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
    }, []);

    const COOLDOWN_MS = 5 * 60 * 1000; 
    const timeSinceLast = now - lastCoffee;
    const canDrink = timeSinceLast >= COOLDOWN_MS;

    const reaminingSecs = Math.max(0, Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000));
    const mins = Math.floor(reaminingSecs / 60);
    const secs = reaminingSecs % 60;

    const drinkCoffee = () => {
        if (!canDrink) return;

        triggerBoost();

        const currentTime = Date.now();
        setLastCoffee(currentTime);
        localStorage.setItem('lastCoffeeTime', currentTime.toString());
    };

    return (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button
                onClick={drinkCoffee}
                disabled={!canDrink || boostActive}
                style={{
                    backgroundColor: canDrink && !boostActive ? 'rgba(255, 153, 0, 0.1)' : 'rgba(255, 255, 0, 0.05)',
                    border: `1px solid ${canDrink && !boostActive ? '#ff9900' : 'var(--border)'}`,
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: canDrink && !boostActive ? 'pointer' : 'not-allowed',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: canDrink && !boostActive ? '0 0 10px rgba(255, 153, 0, 0.5)' : 'none',
                }}
            >
                ☕ {boostActive ? "OVERCLOCKED" : "Drink Coffee"}
            </button>
            {!canDrink && !boostActive && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.7, fontFamily: '"Fira Code", monospace' }}>
                    Brewing: {mins}:{secs.toString().padStart(2, '0')}
                </span>
            )}
        </div>
    )
}