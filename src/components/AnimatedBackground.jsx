import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../hooks/useScroll';
import './AnimatedBackground.css';

const AnimatedBackground = ({ colorScheme = 'brand', intensity = 'medium' }) => {
  const canvasRef = useRef(null);
  const { progress, scrollY } = useScrollProgress();
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const curvesRef = useRef([]);
  const shapesRef = useRef([]);
  const timeRef = useRef(0);

  // Brand colors
  const colors = {
    primary: '#0BA360',
    secondary: '#22AE77',
    accent: '#3CBA92',
    bgDark: '#002130',
    bgLight: '#00314D',
  };

  const particleCount = intensity === 'high' ? 50 : intensity === 'low' ? 20 : 35;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initCurves();
      initShapes();
    };

    // Initialize curved lines - spread out, no overlaps
    const initCurves = () => {
      curvesRef.current = [
        // Top right corner - single elegant arc
        { 
          startX: width * 0.6, startY: -50, 
          cp1X: width * 0.85, cp1Y: height * 0.1, 
          cp2X: width * 0.95, cp2Y: height * 0.25, 
          endX: width + 50, endY: height * 0.35,
          opacity: 0.12, speed: 0.0002, phase: 0
        },
        // Bottom left corner - sweeping arc
        { 
          startX: -50, startY: height * 0.7, 
          cp1X: width * 0.1, cp1Y: height * 0.85, 
          cp2X: width * 0.25, cp2Y: height * 0.95, 
          endX: width * 0.4, endY: height + 50,
          opacity: 0.1, speed: 0.00025, phase: 1
        },
        // Right side vertical arc
        { 
          startX: width + 30, startY: height * 0.5, 
          cp1X: width * 0.88, cp1Y: height * 0.6, 
          cp2X: width * 0.85, cp2Y: height * 0.8, 
          endX: width * 0.9, endY: height + 30,
          opacity: 0.08, speed: 0.0003, phase: 2
        },
      ];
    };

    // Initialize rounded rectangle shapes - corners only, no overlap with content
    const initShapes = () => {
      shapesRef.current = [
        // Top right corner shape
        { 
          x: width * 0.88, y: height * 0.08, 
          width: 100, height: 70, 
          radius: 25, 
          opacity: 0.1, 
          rotationSpeed: 0.00008,
          rotation: 0.1,
          pulseSpeed: 0.001
        },
        // Bottom right corner shape
        { 
          x: width * 0.85, y: height * 0.78, 
          width: 80, height: 120, 
          radius: 30, 
          opacity: 0.08, 
          rotationSpeed: -0.0001,
          rotation: -0.15,
          pulseSpeed: 0.0012
        },
        // Bottom left corner - small shape
        { 
          x: width * 0.05, y: height * 0.85, 
          width: 60, height: 90, 
          radius: 22, 
          opacity: 0.07, 
          rotationSpeed: 0.00012,
          rotation: 0.2,
          pulseSpeed: 0.0015
        },
      ];
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles - spread evenly
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        type: Math.floor(Math.random() * 5),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        colorType: Math.floor(Math.random() * 3),
      }));
    }

    // Draw a curved line with animation
    const drawCurve = (curve, time) => {
      const waveOffset = Math.sin(time * curve.speed + curve.phase) * 20;
      
      ctx.save();
      ctx.globalAlpha = curve.opacity * (0.7 + Math.sin(time * 0.0008) * 0.3);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(curve.startX, curve.startY + waveOffset);
      ctx.bezierCurveTo(
        curve.cp1X, curve.cp1Y + waveOffset * 0.5,
        curve.cp2X, curve.cp2Y - waveOffset * 0.3,
        curve.endX, curve.endY
      );
      ctx.stroke();
      ctx.restore();
    };

    // Draw rounded rectangle shape
    const drawRoundedRect = (shape, time) => {
      const pulse = 1 + Math.sin(time * shape.pulseSpeed) * 0.03;
      const w = shape.width * pulse;
      const h = shape.height * pulse;
      
      ctx.save();
      ctx.translate(shape.x + w / 2, shape.y + h / 2);
      ctx.rotate(shape.rotation + time * shape.rotationSpeed);
      ctx.translate(-w / 2, -h / 2);
      
      ctx.globalAlpha = shape.opacity * (0.8 + Math.sin(time * 0.0006) * 0.2);
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(shape.radius, 0);
      ctx.lineTo(w - shape.radius, 0);
      ctx.quadraticCurveTo(w, 0, w, shape.radius);
      ctx.lineTo(w, h - shape.radius);
      ctx.quadraticCurveTo(w, h, w - shape.radius, h);
      ctx.lineTo(shape.radius, h);
      ctx.quadraticCurveTo(0, h, 0, h - shape.radius);
      ctx.lineTo(0, shape.radius);
      ctx.quadraticCurveTo(0, 0, shape.radius, 0);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw particle shape
    const drawShape = (particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.globalAlpha = particle.opacity * (0.3 + (1 - progress / 100) * 0.3);
      
      const color = particle.colorType === 0 
        ? colors.primary 
        : particle.colorType === 1 
          ? colors.secondary 
          : colors.accent;
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      const size = particle.size * 2;

      switch (particle.type) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Square
          ctx.fillRect(-size, -size, size * 2, size * 2);
          break;
        case 2: // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, size);
          ctx.lineTo(-size, size);
          ctx.closePath();
          ctx.fill();
          break;
        case 3: // Hexagon outline
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = size * Math.cos(angle);
            const py = size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          break;
        case 4: // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.2);
          ctx.lineTo(size, 0);
          ctx.lineTo(0, size * 1.2);
          ctx.lineTo(-size, 0);
          ctx.closePath();
          ctx.fill();
          break;
        default:
          break;
      }

      ctx.restore();
    };

    // Draw subtle glow effect - corners only
    const drawGlow = (x, y, radius, time, offsetPhase = 0) => {
      const pulse = 0.7 + Math.sin(time * 0.0004 + offsetPhase) * 0.3;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * pulse);
      gradient.addColorStop(0, 'rgba(11, 163, 96, 0.2)');
      gradient.addColorStop(0.5, 'rgba(11, 163, 96, 0.08)');
      gradient.addColorStop(1, 'rgba(11, 163, 96, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3, radius * 3);
    };

    const animate = () => {
      timeRef.current += 16;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      // Draw glows in corners only (not overlapping content)
      drawGlow(width * 0.92, height * 0.15, 200, time, 0);
      drawGlow(width * 0.08, height * 0.88, 180, time, 1.5);

      // Draw curved lines
      curvesRef.current.forEach(curve => drawCurve(curve, time));

      // Draw rounded shapes
      shapesRef.current.forEach(shape => drawRoundedRect(shape, time));

      // Update and draw particles
      const parallaxFactor = 0.08;
      const offsetY = scrollY * parallaxFactor;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const displayY = (particle.y + offsetY) % (height + 40) - 20;
        const tempParticle = { ...particle, y: displayY };

        drawShape(tempParticle);
      });

      // Draw connection lines - less frequent
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = 0.05 * (1 - distance / 100);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [progress, scrollY, particleCount]);

  return <canvas ref={canvasRef} className="animated-background" />;
};

export default AnimatedBackground;
