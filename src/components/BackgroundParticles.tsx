import React, { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  theme?: string;
  intensity?: 'soft' | 'party';
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  theme = 'rose',
  intensity = 'soft',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const count = intensity === 'party' ? 45 : 25;
    const particles: Particle[] = [];

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      shape: 'heart' | 'sparkle' | 'circle' | 'moon';
    }

    const getColor = () => {
      if (theme === 'natural') {
        const colors = ['#8A897C', '#C2BEAF', '#A38F78', '#D6CEBD', '#5D5B4A'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      if (theme === 'lavender') {
        const colors = ['#E9D5FF', '#C084FC', '#F472B6', '#DDD6FE'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      if (theme === 'midnight') {
        const colors = ['#FDE68A', '#FEF08A', '#93C5FD', '#E0E7FF', '#F472B6'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      if (theme === 'sunset') {
        const colors = ['#FDE68A', '#FCA5A5', '#FDBA74', '#F472B6'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      // Rose default
      const colors = ['#FECDD3', '#FDA4AF', '#F472B6', '#FFE4E6', '#FB7185'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    for (let i = 0; i < count; i++) {
      const randShape = Math.random();
      let shape: 'heart' | 'sparkle' | 'circle' | 'moon' = randShape > 0.4 ? 'heart' : randShape > 0.2 ? 'sparkle' : 'circle';
      if (theme === 'midnight' && randShape > 0.5) {
        shape = 'moon';
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        color: getColor(),
        shape,
      });
    }

    const drawHeart = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate((rotation * Math.PI) / 180);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      // bottom right curve
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawSparkle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number
    ) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(0, size);
        c.lineTo(size * 0.25, size * 0.25);
      }
      c.fill();
      c.restore();
    };

    const drawMoon = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate((rotation * Math.PI) / 180);
      c.globalAlpha = opacity;
      c.fillStyle = color;
      c.beginPath();
      c.arc(0, 0, size * 0.7, 0, Math.PI * 2, false);
      c.fill();
      // Cut out circle to make crescent
      c.globalCompositeOperation = 'destination-out';
      c.beginPath();
      c.arc(size * 0.35, -size * 0.2, size * 0.6, 0, Math.PI * 2, false);
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        if (p.shape === 'moon') {
          drawMoon(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.shape === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size * 0.8, p.color, p.opacity);
        } else {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
    />
  );
};
