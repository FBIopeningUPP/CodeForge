import { useStore } from './store';

export default function Notifications() {
    const notifications = useStore((state) => state.notifications) || [];
    
    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 9999,
            pointerEvents: 'none',
        }}>
            {notifications.map(note => (
                <div key={note.id} style={{
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    borderLeft: `4px solid ${note.type === 'success' ? '#ffea00' : 'var(--cyan)'}`,
                    color: 'var(--text)',
                    padding: '1rem 1.5rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontFamily: '"Share Tech Mono", monospace',
                    animation: 'slideIn 0.3s ease-out forwards',
                    minWidth: '250px',
                }}>
                    {note.message}
                </div>
            ))}
            <style>
                {`
                    @keyframes slideIn {
                        from {transform: translateX(100%); opacity: 0;}
                        to {transform: translateX(0); opacity: 1;}
                    }
                `}
            </style>
        </div>
    )
}