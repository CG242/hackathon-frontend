"use client";

import React, { useRef, useEffect } from 'react';

const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; baseSize: number; speedX: number; speedY: number; angle: number }[] = [];
    const particleCount = 200;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      const bodyHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      canvas.height = bodyHeight > windowHeight ? bodyHeight : windowHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          baseSize: size,
          speedX: Math.random() * 0.8 - 0.4,
          speedY: Math.random() * 0.8 - 0.4,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      if(!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += 0.02;
        p.size = p.baseSize + Math.sin(p.angle) * 0.5;


        if (p.x < -p.size) p.x = canvas.width + p.size;
        if (p.x > canvas.width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.height + p.size;
        if (p.y > canvas.height + p.size) p.y = -p.size;

        ctx.shadowColor = 'hsla(195, 100%, 70%, 1)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'hsla(195, 100%, 50%, 0.7)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      if(!ctx) return;
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const distance = Math.sqrt(
            Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2)
          );
          if (distance < 120) {
            opacityValue = 1 - (distance / 120);
            ctx.strokeStyle = `hsla(26, 100%, 70%, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    const observer = new MutationObserver((mutations) => {
        for(let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const newHeight = document.body.scrollHeight;
                if (canvas.height !== newHeight) {
                    resizeCanvas();
                }
                break;
            }
        }
    });

    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default BackgroundParticles;
