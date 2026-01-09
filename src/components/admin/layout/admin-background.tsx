'use client';

import React, { useRef, useEffect } from 'react';

const AdminBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      color: string;
    }[] = [];
    const particleCount = 2000;

    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150,
    };
    
    let container = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const card = document.querySelector('[data-login-card]');
      if (card) {
        const rect = card.getBoundingClientRect();
        container.x = rect.left;
        container.y = rect.top;
        container.width = rect.width;
        container.height = rect.height;
      } else {
        container.x = canvas.width / 2 - 200;
        container.y = canvas.height / 2 - 250;
        container.width = 400;
        container.height = 500;
      }
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5 + 1;
        particles.push({
          x,
          y,
          size,
          baseX: x,
          baseY: y,
          density: (Math.random() * 30) + 1,
          color: `hsl(${200 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%)`,
        });
      }
    };

    const animate = () => {
      if(!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        let dx = (mouse.x ?? canvas.width / 2) - p.x;
        let dy = (mouse.y ?? canvas.height / 2) - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        
        const maxDistance = mouse.radius * 2;
        const force = (maxDistance - distance) / maxDistance;
        
        let directionX = 0;
        let directionY = 0;

        if (distance < maxDistance) {
          directionX = forceDirectionX * force * p.density * 0.6;
          directionY = forceDirectionY * force * p.density * 0.6;
        }

        // Shield effect around the login card
        const isNearCardX = p.baseX > container.x - 50 && p.baseX < container.x + container.width + 50;
        const isNearCardY = p.baseY > container.y - 50 && p.baseY < container.y + container.height + 50;

        if (isNearCardX && isNearCardY) {
            // Repel from center of card
             let repelDx = p.x - (container.x + container.width / 2);
             let repelDy = p.y - (container.y + container.height / 2);
             let repelDistance = Math.sqrt(repelDx*repelDx + repelDy*repelDy);
             let maxRepelDist = container.width/2;

             if(repelDistance < maxRepelDist) {
                 const repelForce = (maxRepelDist - repelDistance) / maxRepelDist;
                 p.x += (repelDx / repelDistance) * repelForce * 2;
                 p.y += (repelDy / repelDistance) * repelForce * 2;
             }
        }
        
        // Return to base position
        p.x += directionX + (p.baseX - p.x) * 0.05;
        p.y += directionY + (p.baseY - p.y) * 0.05;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
    
    // Sometimes the card is not available on first render
    setTimeout(resizeCanvas, 100);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-background" />;
};

export default AdminBackground;
