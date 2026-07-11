import { useEffect, useState } from "react";
import { useStore } from "./store";

export default function GoldenBug() {
    const [bug, setBug] = useState({ visible: false, x: 0, y: 0 });
    const triggerBoost = useStore((state) => state.triggerBoost);

    useEffect(() => {
        const spawnBug = () => {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight - 100) + 50;
        setBug({ visible: true, x, y });

        setTimeout(() => {
            setBug(prev => ({ ...prev, visible: false }));
        }, 8000);
    };

    const scheduleNext = () => {
        const delay = Math.random() * 60000 + 60000;
        setTimeout(() => {
            spawnBug();
            scheduleNext();
        }, delay);
    };

    setTimeout(() => {
        spawnBug();
        scheduleNext();
    }, 5000);
}, []);

if (!bug.visible) return null;

return (
    <div
        onClick={() => {
            setBug({ visible: false, x: 0, y: 0 });
            triggerBoost();
            alert("Got a bug less go get a boost");
        }}
        style={{
            position: "absolute",
            left: bug.x,
            top: bug.y,
            fontSize: "4rem",
            cursor: "pointer",
            zIndex: 50,
            textShadow: "0 0 10px gold, 0 0 20px gold, 0 0 30px gold",
            transition: "all 0.1s ease",
        }}
        title="Squish the bug for boost!"
    >
        🐞
    </div>
    );
}
