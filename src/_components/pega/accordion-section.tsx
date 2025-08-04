// AccordionOnScroll.tsx
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Section = {
  title: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    title: "All-screen design.",
    content: (
      <p>
        Lets you immerse yourself in whatever you’re reading, watching, or
        creating. The 10.9-inch Liquid Retina display features advanced
        technologies like True Tone, P3 wide color, and an antireflective
        coating.1
      </p>
    ),
  },
  {
    title: "Beauty all around.",
    content: (
      <p>
        The breakthrough M1 chip is now in Air. An 8-core CPU delivers up to 60
        percent faster performance than the previous generation, making Air a
        creative and mobile gaming powerhouse. Multitask smoothly between
        powerful apps and play graphics-intensive games. And with M1, you can go
        even further with your creativity with apps like SketchUp.
      </p>
    ),
  },
  {
    title: "Take Center Stage.",
    content: (
      <p>
        The 12MP Ultra Wide front camera enables Center Stage, making video
        calls more natural and content creation more fun. As you move around,
        the camera automatically pans to keep you centered in the shot. When
        others join or leave the frame, the view expands or zooms in.
      </p>
    ),
  },
  {
    title: "Pretty everywhere.",
    content: (
      <p>
        Join superfast 5G wireless networks when you’re on the go. Download
        files, play multiplayer games, stream movies, check in with friends, and
        more.
      </p>
    ),
  },
];

export default function AccordionOnScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!itemRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick entry with largest intersection ratio that's above threshold
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((e) => {
          if (
            (!best || e.intersectionRatio > best.intersectionRatio) &&
            e.isIntersecting
          ) {
            best = e;
          }
        });
        if (best) {
          const idx = Number(best.target.getAttribute("data-index"));
          setActiveIndex(idx);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -30% 0px", // trigger when roughly middle of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5c2fa6] to-[#5a36c0] px-4 py-20 font-sans text-white">
      <div className="mx-auto max-w-3xl space-y-16">
        {sections.map((sec, i) => (
          <div
            key={i}
            data-index={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative"
          >
            <div
              className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 p-6 shadow-2xl"
              aria-expanded={activeIndex === i}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="text-lg font-medium">{i + 1}.</div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl leading-tight font-semibold">
                    {sec.title}
                  </h2>
                  <AnimatePresence initial={false}>
                    {activeIndex === i && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 170,
                          damping: 25,
                        }}
                        className="mt-4 min-h-[900px] text-sm leading-relaxed"
                      >
                        {sec.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
