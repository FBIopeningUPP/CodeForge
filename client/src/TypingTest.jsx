import { useState, useEffect } from "react";
import { useStore } from "./store";

const PROMPTS = [
    'npm run dev',
    'git push --force',
    'rm -rf node_modules',
    'console.log("Hello, World!")',
    'sudo apt-get update && sudo apt-get upgrade',
    'docker-compose up -d',
    'SELECT * FROM users;',
    'npm install react',
];

export default function TypingTest() {
    const [active, setActive] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(10);

    const locPerSec = useStore((state) => state.locPerSec);
    const addAutoLoc = useStore((state) => state.addAutoLoc);

    useEffect(() => {
        let timeoutId;

        const triggerTest = () => {
            setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
            setInput('');
            setTimeLeft(10);
            setActive(true);
        };

        const scheduleNext = () => {
            const delay = Math.random() * 45000 + 45000;
            timeoutId = setTimeout(() => {
                triggerTest();
            }, delay);
        };

        if (!active) {
            scheduleNext();
        }
        return () => clearTimeout(timeoutId);
    }, [active]);

    useEffect(() => {
        if (!active) return;

        if (timeLeft <= 0) {
            setActive(false);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [active, timeLeft]);

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);

        if (val === prompt) {
            const reward = Math.max(100, locPerSec * 120);
            addAutoLoc(reward);
            setActive(false);
            alert(`💻 HACK SUCCESSFUL! Earned ${Math.floor(reward).toLocaleString()} LoC!`);
        }
    };

    if (!active) return null;

    return (
        <div style={styles.terminal}>
            <div style={styles.header}>INCOMING URGENT TASK ({timeLeft}s)</div>
            <p style={styles.prompt}>Type this exactly: <br/><strong style={{color:'var(--cyan)'}}>{prompt}</strong></p>
            <input
                autoFocus
                style={styles.input}
                value={input}
                onChange={handleChange}
                placeholder="Type here..."
                spellCheck={false}
                autoComplete="off"
            />
        </div>
    );
}

const styles = {
    terminal: {
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(15, 15, 25, 0.95)',
        border: '1px solid var(--cyan)',
        borderRadius: '8px',
        padding: '1.5rem',
        width: '400px',
        zIndex: 100,
        boxShadow: '0 0 20px rgba(88, 166, 255, 0.3)',
        textAlign: 'center',
    },
    header: {
        color: '#ff4444',
        fontWeight: 'bold',
        marginBottom: '1rem',
        fontFamily: '"Share Tech Mono", monospace',
    },
    prompt: {
        color: 'var(--text)',
        marginBottom: '1rem',
        fontSize: '1.2rem',
        fontFamily: '"Fira Code", monospace',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        border: '1px solid var(--border)',
        color: 'var(--green)',
        padding: '0.75rem',
        fontFamily: '"Fira Code", monospace',
        fontSize: '1.2rem',
        outline: 'none',
        textAlign: 'center',
        borderRadius: '4px',
    }
}