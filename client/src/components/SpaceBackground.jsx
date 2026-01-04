import React, { useRef, useEffect } from 'react';

const SpaceBackground = ({ isHoveringUI }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const mouseRef = useRef({ x: 0, y: 0 });
    const shipRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0, targetStar: null });
    const starsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            starsRef.current = [];
            for (let i = 0; i < 2000; i++) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    speed: Math.random() * 0.5
                });
            }
        };

        const drawShip = (x, y, angle) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(1.5, 1.5); // Bigger ship

            ctx.strokeStyle = '#bf00ff'; // Bright Purple Neon
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-10, 7);
            ctx.lineTo(-10, -7);
            ctx.closePath();
            ctx.stroke();

            // Engine detail
            ctx.fillStyle = '#00f0ff'; // Cyan engine glow
            ctx.beginPath();
            ctx.arc(-10, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear but keep transparency

            // Draw Stars
            ctx.fillStyle = '#ffffff';
            starsRef.current.forEach(star => {
                ctx.globalAlpha = star.alpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });

            // Update Ship
            const ship = shipRef.current;
            let targetX, targetY;

            if (!isHoveringUI) {
                // Manual Mode: Follow Mouse
                targetX = mouseRef.current.x;
                targetY = mouseRef.current.y;
            } else {
                // Auto Mode: Target random star or drift
                if (!ship.targetStar || !starsRef.current.includes(ship.targetStar)) {
                    // Find a new target star
                    if (starsRef.current.length > 0) {
                        ship.targetStar = starsRef.current[Math.floor(Math.random() * starsRef.current.length)];
                    }
                }

                if (ship.targetStar) {
                    targetX = ship.targetStar.x;
                    targetY = ship.targetStar.y;
                } else {
                    // Idle drift center if no stars
                    targetX = canvas.width / 2;
                    targetY = canvas.height / 2;
                }
            }

            // Physics Movement
            const dx = targetX - ship.x;
            const dy = targetY - ship.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Rotate towards target
            const targetAngle = Math.atan2(dy, dx);
            let angleDiff = targetAngle - ship.angle;

            // Normalize angle
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            ship.angle += angleDiff * 0.1; // Smooth rotation

            // Move ship
            const speed = isHoveringUI ? 4 : 6; // Slower in auto mode
            if (distance > 5) {
                ship.x += Math.cos(ship.angle) * speed;
                ship.y += Math.sin(ship.angle) * speed;
            }

            drawShip(ship.x, ship.y, ship.angle);

            // Star Physics (Repulsion & Collision)
            const shipTipX = ship.x + Math.cos(ship.angle) * 15;
            const shipTipY = ship.y + Math.sin(ship.angle) * 15;

            starsRef.current.forEach(star => {
                // Repulsion
                const dx = star.x - ship.x;
                const dy = star.y - ship.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 150;

                if (dist < repelRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (repelRadius - dist) / repelRadius; // Stronger closer
                    const repelSpeed = 4 * force;

                    star.x += Math.cos(angle) * repelSpeed;
                    star.y += Math.sin(angle) * repelSpeed;
                }
            });

            // Filter out collided stars (Collision)
            starsRef.current = starsRef.current.filter(star => {
                const d = Math.sqrt((star.x - shipTipX) ** 2 + (star.y - shipTipY) ** 2);
                return d > 20; // Hit radius adjusted
            });

            // Replenish stars
            if (starsRef.current.length < 500) {
                starsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    speed: Math.random() * 0.5
                });
            }

            requestRef.current = requestAnimationFrame(update);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        requestRef.current = requestAnimationFrame(update);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(requestRef.current);
        };
    }, [isHoveringUI]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 50, // Floating above everything
                pointerEvents: 'none', // Allow clicks to pass through
                background: 'transparent' // Transparent to show UI below (stars/ship derived from clearRect)
            }}
        />
    );
};

export default SpaceBackground;
