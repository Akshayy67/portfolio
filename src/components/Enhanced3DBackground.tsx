import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDeviceDetection } from "../hooks/useDeviceDetection";

interface Enhanced3DBackgroundProps {
  className?: string;
  theme?: "space" | "tech" | "achievements" | "contact" | "hobbies";
}

const Enhanced3DBackground: React.FC<Enhanced3DBackgroundProps> = ({
  className = "",
  theme = "space",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deviceInfo = useDeviceDetection();
  const shouldAnimate = !deviceInfo.prefersReducedMotion;

  useEffect(() => {
    if (!canvasRef.current || !shouldAnimate) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 3D Particle System
    class Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;

      constructor() {
        this.x = (Math.random() - 0.5) * 2000;
        this.y = (Math.random() - 0.5) * 2000;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.vz = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 3 + 1;
        this.life = Math.random() * 100;
        this.maxLife = 100;

        // Theme-based colors
        const colors = {
          space: ["#fb923c", "#f97316", "#ea580c", "#ffffff"],
          tech: ["#3b82f6", "#1d4ed8", "#1e40af", "#60a5fa"],
          achievements: ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d"],
          contact: ["#10b981", "#059669", "#047857", "#34d399"],
          hobbies: ["#a855f7", "#9333ea", "#7c3aed", "#c084fc"],
        };

        this.color =
          colors[theme][Math.floor(Math.random() * colors[theme].length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.life--;

        // Reset particle when it dies or goes too far
        if (this.life <= 0 || this.z > 1000 || this.z < -500) {
          this.x = (Math.random() - 0.5) * 2000;
          this.y = (Math.random() - 0.5) * 2000;
          this.z = -500;
          this.life = this.maxLife;
        }
      }

      draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
        // 3D projection
        const scale = 200 / (200 + this.z);
        const x2d = centerX + this.x * scale;
        const y2d = centerY + this.y * scale;
        const size2d = this.size * scale;

        // Prevent drawing with non-positive radius
        if (size2d <= 0) return;

        if (x2d < 0 || x2d > canvas.width || y2d < 0 || y2d > canvas.height)
          return;

        const alpha = (this.life / this.maxLife) * scale;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fill();

        // Add inner glow
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Create particles
    const particles: Particle3D[] = [];
    const particleCount = deviceInfo.isLowEndDevice ? 50 : 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle3D());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );

      const gradients = {
        space: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)"],
        tech: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)"],
        achievements: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)"],
        contact: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)"],
        hobbies: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)"],
      };

      gradient.addColorStop(0, gradients[theme][0]);
      gradient.addColorStop(1, gradients[theme][1]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx, centerX, centerY);
      });

      // Draw connecting lines between nearby particles
      if (!deviceInfo.isLowEndDevice) {
        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const dz = particle.z - otherParticle.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 200) {
              const scale1 = 200 / (200 + particle.z);
              const scale2 = 200 / (200 + otherParticle.z);
              const x1 = centerX + particle.x * scale1;
              const y1 = centerY + particle.y * scale1;
              const x2 = centerX + otherParticle.x * scale2;
              const y2 = centerY + otherParticle.y * scale2;

              ctx.save();
              ctx.globalAlpha = (1 - distance / 200) * 0.3;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
              ctx.restore();
            }
          });
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme, shouldAnimate, deviceInfo]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      />
      {/* Additional CSS-based 3D effects */}
      <div className="absolute inset-0 overflow-hidden">
        {shouldAnimate &&
          [...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                width: `${40 + i * 10}px`,
                height: `${40 + i * 10}px`,
              }}
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                rotateZ: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div
                className={`w-full h-full border-2 ${
                  theme === "space"
                    ? "border-orange-400"
                    : theme === "tech"
                    ? "border-blue-400"
                    : theme === "achievements"
                    ? "border-yellow-400"
                    : theme === "contact"
                    ? "border-green-400"
                    : "border-purple-400"
                }`}
                style={{
                  transform: "rotateX(45deg) rotateY(45deg)",
                  transformStyle: "preserve-3d",
                }}
              />
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Enhanced3DBackground;
