import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";
import type { Engine } from "tsparticles-engine";

export default function BackgroundCanvas() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadLinksPreset(engine);
  }, []);

  return (
    <Particles
      className="z-0"
      id="tsparticles"
      init={particlesInit}
      options={{
        preset: "links",
        background: { color: { value: "#0f0f1a" } },
        particles: {
          color: { value: ["#00e5ff", "#ff00ff"] },
          links: { color: "#ffffff", opacity: 0.3 },
          move: { speed: 1 },
          number: { value: 80 },
          opacity: { value: 0.6 },
          size: { value: { min: 1, max: 3 } },
        },
        fullScreen: { enable: true, zIndex: -1 },
      }}
    />
  );
}
