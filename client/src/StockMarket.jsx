import { useStore } from './store'
import { useEffect } from 'react'

export default function StockMarket() {
    const stocks = useStore(state => state.stocks) || [];
    const loc = useStore(state => state.loc);
    const updateStocks = useStore(state => state.updateStock);
    const buyStock = useStore(state => state.buyStock);
    const sellStock = useStore(state => state.sellStock);

    useEffect(() => {
        const interval = setInterval(() => {
            updateStocks();
        }, 3000);
        return () => clearInterval(interval);
    }, [updateStocks]);

    return (
        <div style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
            <h4 style={{ color: 'var(--cyan)', marginBottom: '1rem', marginTop: '1rem', fontFamily: '"Share Tech Mono", monospace', fontSize: '1.5rem'}}>Tech Exchange</h4>
            <p style={{ color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Wallet: <strong style={{color: 'var(--green)'}}>{Math.floor(loc).toLocaleString()}</strong> LoC
            </p>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stocks.map(stock => {
                    const trend = stock.history[stock.history.length - 1] - stock.history[stock.history.length - 2];
                    const trendColor = trend >= 0 ? 'var(--green)' : '#ff4444';

                    return (
                        <div key={stock.id} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '1rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ color: 'var(--cyan)', margin: 0, fontFamily: '"Share Tech Mono", monospace' }}>{stock.name}</h3>
                                <div style={{ color: trendColor, fontWeight: 'bold', fontFamily: '"Fira Code", monospace' }}>
                                    {trend >= 0 ? '▲' : '▼'} {stock.price.toLocaleString()} LoC
                                </div>
                            </div>
                        <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end', marginBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                            {stock.history.map((price, i) => {
                                const maxPrice = Math.max(...stock.history);
                                const heightPercent = (price / maxPrice) * 100;
                                return (
                                    <div key={i} style={{
                                        flex: 1,
                                        backgroundColor: trendColor,
                                        height: `${heightPercent}%`,
                                        opacity: 0.2 + (i / stock.history.length) * 0.8,
                                        transition: 'all 0.2s ease',
                                    }}></div>
                                )
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>Owned: <strong style={{fontFamily: '"Fira Code", monospace'}}>{stock.owned}</strong></span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => buyStock(stock.id, 1)} style={styles.actionBtn}>Buy 1</button>
                                <button onClick={() => sellStock(stock.id, 1)} style={styles.actionBtn}>Sell 1</button>
                            </div>
                        </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    actionBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: '"Fira Code", monospace',
        transition: 'all 0.2s ease',
    }
}