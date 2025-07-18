import React, { useEffect, useRef, useState } from "react";

const typewriterTexts = [
  "Curious minds and cosmic explorers welcome. Reach out and let’s build the future.",
  "Ready to go beyond the horizon? Connect and let’s make your vision a reality.",
  "Adventure awaits in the stars above. Dream big, create boldly.",
  "From moon dust to galaxies, your journey starts here.",
  "The universe is vast, but your ideas make it brighter. Let’s create something stellar together.",
  "Every great journey begins with a single spark. Ignite yours here. Grind!",
];

const CinematicFooter: React.FC = () => {
  // Mouse movement for parallax and lens flare
  const footerRef = useRef<HTMLDivElement>(null);
  const lensFlareRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);

  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (footerRef.current && lensFlareRef.current && nebulaRef.current) {
        const { left, width } = footerRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        // Parallax for lens flare
        lensFlareRef.current.style.transform = `translateX(-50%) translateX(${
          (x - width / 2) / 20
        }px)`;
        // Parallax for nebula
        nebulaRef.current.style.transform = `translateX(-50%) translateY(${
          (x - width / 2) / 40
        }px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (charIndex < typewriterTexts[textIndex].length) {
      const timeout = setTimeout(() => {
        setDisplayedText(
          (prev) => prev + typewriterTexts[textIndex][charIndex]
        );
        setCharIndex((prev) => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      // Pause before next text
      const pause = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % typewriterTexts.length);
      }, 1800);
      return () => clearTimeout(pause);
    }
  }, [charIndex, textIndex]);

  return (
    <footer
      ref={footerRef}
      className="relative h-[500px] w-full overflow-hidden bg-gradient-to-b from-[#0a0f1c] via-[#101a2e] to-[#1a233a]"
    >
      {/* Animated Parallax Stars (Twinkling) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1920}
              cy={Math.random() * 500}
              r={Math.random() * 1.2 + 0.3}
              fill="#b3e0ff"
              className="twinkle"
              opacity={Math.random() * 0.7 + 0.3}
            />
          ))}
        </svg>
      </div>
      {/* Animated Nebula/Aurora Layer */}
      <div
        ref={nebulaRef}
        className="absolute left-1/2 top-1/3 z-20 w-[600px] h-[180px] pointer-events-none"
        style={{ transform: "translateX(-50%)" }}
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-400/30 via-purple-400/20 to-pink-400/30 blur-3xl opacity-40 animate-nebula" />
      </div>
      {/* Background: Blackhole */}
      <div className="absolute inset-0 z-0">
        <img
          src="/blackhole.webp"
          alt="Blackhole"
          className="w-full h-full object-cover opacity-85 blur-[0.5px]"
        />
        {/* Lens Flare */}
        <div
          className="absolute left-1/2 bottom-0 w-[400px] h-[80px] z-20"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-300/20 via-white/5 to-blue-300/20 blur" />
        </div>
      </div>
      {/* Floating Dust Particles (Parallax) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-blue-200/30 blur-[2px] animate-dust"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      {/* Footer Text with Typewriter Effect */}
      <div className="absolute bottom-0 left-0 w-full z-40 text-center pb-6">
        <div className="absolute left-0 bottom-0 w-full h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <h2 className="relative text-2xl font-bold mb-2 tracking-wide font-sans text-white drop-shadow-lg">
          Embark on Your Cosmic Journey
        </h2>
        <p className="relative text-base font-semibold font-sans text-white/90 drop-shadow">
          Dream big, create boldly, explore endlessly.
        </p>
        <p className="relative text-white text-base font-semibold font-mono min-h-[32px]">
          {displayedText}
          <span className="animate-blink">|</span>
        </p>
      </div>
      {/* Keyframes for effects */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .twinkle { animation: twinkle 2s infinite ease-in-out; }
        @keyframes dust {
          0% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.7; }
        }
        .animate-dust { animation: dust 6s ease-in-out infinite; }
        @keyframes nebula {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .animate-nebula { animation: nebula 8s infinite alternate; }
        @keyframes lensFlare {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-lensFlare { animation: lensFlare 5s infinite alternate; }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 80px #6ecaff) brightness(1.2) saturate(1.3); }
          50% { filter: drop-shadow(0 0 120px #6ecaff) brightness(1.4) saturate(1.5); }
        }
        .animate-pulseGlow { animation: pulseGlow 4s infinite alternate; }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 2px #6ecaff, 0 0 4px #6ecaff; }
          50% { text-shadow: 0 0 4px #b3e0ff, 0 0 8px #b3e0ff; }
        }
        .animate-textGlow { animation: textGlow 3s infinite alternate; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s steps(2, start) infinite; }
      `}</style>
    </footer>
  );
};

export default CinematicFooter;
