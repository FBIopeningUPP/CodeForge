import { useState } from "react"

export default function FloatingText({ clickPower, containerRef}) {
    const [floats, setFloats] = useState([])

    const spawn = e => {
        const rect = containerRef.current.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const id = Date.now() + Math.random()

        setFloats(prev => [...prev, { id, x, y, value: clickPower }])

        setTimeout(() => {
            setFloats(prev => prev.filter(f => f.id !== id))
        }, 800)
    }

    return {spawn, floats}
}

export function FloatingNumbers({ floats }) {
    return (
        <>
            {floats.map(f => (
                <span
                    key={f.id}
                    style={{
                        position: "absolute",
                        left: f.x,
                        top: f.y,
                        color: 'var(--green)',
                        fontSize: '1.5rem',
                        fontFamily: '"Fira Code", monospace',
                        fontWeight: 'bold',
                        pointerEvents: 'none',
                        animation: 'floatUp 0.8s ease-out forwards',
                    }}
                >
                    +{f.value}
                </span>
            ))}
        </>
    )
}