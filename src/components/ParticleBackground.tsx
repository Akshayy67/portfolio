import React, { useCallback, useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface ParticleBackgroundProps {
  isDarkMode?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  isDarkMode = true,
}) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: isDarkMode ? "black" : "white",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: { enable: true },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: isDarkMode ? "#fb923c" : "#d97706",
        },
        links: {
          color: isDarkMode ? "#fb923c" : "#d97706",
          distance: 150,
          enable: true,
          opacity: isDarkMode ? 0.3 : 0.15,
          width: 1,
        },
        move: {
          direction: "none" as const,
          enable: true,
          outModes: {
            default: "bounce" as const,
          },
          random: false,
          speed: isDarkMode ? 1 : 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: isDarkMode ? 80 : 40,
        },
        opacity: {
          value: isDarkMode ? 0.5 : 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: isDarkMode ? 3 : 2 },
        },
      },
      detectRetina: true,
    }),
    [isDarkMode]
  );

  if (!init) return null;
  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 z-20"
    />
  );
};

export default ParticleBackground;
