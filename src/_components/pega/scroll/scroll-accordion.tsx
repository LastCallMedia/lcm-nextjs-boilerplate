// ScrollAccordion.tsx
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

const sections = [
  {
    title: "All-screen design.",
    text: `Lets you immerse yourself in whatever you’re reading, watching, or creating. The 10.9-inch Liquid Retina display features advanced technologies like True Tone, P3 wide color, and an antireflective coating.1`,
    gradient: "from-[#1d91fc] via-[#5c2fa6] to-[#5a36c0]",
  },
  {
    title: "Beauty all around.",
    text: `The breakthrough M1 chip is now in Air. An 8-core CPU delivers up to 60 percent faster performance than the previous generation, making Air a creative and mobile gaming powerhouse. Multitask smoothly between powerful apps and play graphics-intensive games. And with M1, you can go even further with your creativity with apps like SketchUp.`,
    gradient: "from-[#f28885] via-[#e94f66]",
  },
  {
    title: "Take Center Stage.",
    text: `The 12MP Ultra Wide front camera enables Center Stage, making video calls more natural and content creation more fun. As you move around, the camera automatically pans to keep you centered in the shot. When others join or leave the frame, the view expands or zooms in.`,
    gradient: "from-[#65bb76] via-[#4671ab]",
  },
  {
    title: "Pretty everywhere.",
    text: `Join superfast 5G wireless networks when you’re on the go. Download files, play multiplayer games, stream movies, check in with friends, and more.`,
    gradient: "from-[#c215d1] via-[#9813a1]",
  },
];

export default function ScrollAccordion() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // We'll map scroll progress to each accordion's collapse trigger with stagger
  // Divide the total 0-1 into N+1 segments; each section collapses in order.
  const num = sections.length;
  const texts = sections.map((_, i) => {
    // collapse starts at i/(num+1), ends at (i + 1)/(num+1)
    const start = i / (num + 1);
    const end = (i + 1) / (num + 1);

    // map progress to 1 -> 0 over that range
    const opacityRange = useTransform(scrollYProgress, [start, end], [1, 0]);
    const heightRange = useTransform(scrollYProgress, [start, end], [1, 0]);
    // smooth the motion
    const opacity = useSpring(opacityRange, { stiffness: 120, damping: 20 });
    const scaleY = useSpring(heightRange, { stiffness: 120, damping: 20 });

    return { opacity, scaleY };
  });

  return (
    <div className="min-h-[200vh] bg-gradient-to-br from-[#5c2fa6] to-[#5a36c0] font-sans text-white">
      <div className="h-[70vh]" /> {/* spacer top */}
      <div className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {/* Sticky pinned section */}
          <div
            ref={containerRef}
            className="sticky top-16 z-10 flex w-full flex-col gap-10"
            style={{ paddingBottom: "200px" }}
          >
            {sections.map((sec, i) => (
              <div
                key={i}
                className={`relative w-full max-w-[600px] overflow-hidden rounded-2xl shadow-2xl`}
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br p-6 md:p-8 ${sec.gradient} drop-shadow-xl`}
                >
                  <div className="flex flex-col gap-4">
                    <h2 className="text-[clamp(1.5rem,2vw,2.5rem)] leading-tight font-semibold">
                      {sec.title}
                    </h2>
                    <motion.div
                      className="overflow-hidden text-[clamp(0.9rem,1vw,1.1rem)] leading-relaxed"
                      style={{
                        opacity: texts[i].opacity,
                        scaleY: texts[i].scaleY,
                        transformOrigin: "top",
                      }}
                    >
                      <p className="pb-5">{sec.text}</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[70vh]" /> {/* spacer bottom */}
    </div>
  );
}
