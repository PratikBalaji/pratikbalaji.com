import { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
  className?: string;
}

export default function AudioVisualizer({ analyser, isActive, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || !isActive) {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 4;
      const bars = 64;

      for (let i = 0; i < bars; i++) {
        const dataIndex = Math.floor((i / bars) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;

        const innerRadius = maxRadius * 0.35;
        const barHeight = value * maxRadius * 0.6;

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (innerRadius + barHeight);

        const hue = 200 + value * 40;
        const alpha = 0.4 + value * 0.6;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, 100%, ${60 + value * 20}%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
      }

      // Center glow
      const avgValue = dataArray.reduce((a, b) => a + b, 0) / bufferLength / 255;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.35);
      gradient.addColorStop(0, `hsla(210, 100%, 70%, ${0.15 + avgValue * 0.3})`);
      gradient.addColorStop(1, 'hsla(210, 100%, 70%, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [analyser, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className={`${className}`}
      style={{ imageRendering: 'auto' }}
    />
  );
}
