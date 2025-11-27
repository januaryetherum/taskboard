import { useState, useEffect, useRef } from 'react';
import './CursorFollower.css';

const CursorFollower = () => {
  const glowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationId;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const animate = () => {
      // Smooth interpolation
      const lerp = 0.15;
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * lerp;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * lerp;

      if (glowRef.current) {
        glowRef.current.style.left = `${positionRef.current.x}px`;
        glowRef.current.style.top = `${positionRef.current.y}px`;
      }

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div
      ref={glowRef}
      className={`cursor-glow ${isVisible ? 'visible' : ''}`}
    />
  );
};

export default CursorFollower;
