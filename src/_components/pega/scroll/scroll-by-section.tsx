import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const sections = [
  {
    title: "Contact Center Desktop",
    content:
      "Intelligently guide and seamlessly automate every customer service journey.",
  },
  {
    title: "Customer Service AI",
    content: "How AI improves customer service.",
  },
  {
    title: "Digital Engagement",
    content: "Unify customer service messaging for digital channels.",
  },
  {
    title: "Digital Self-Service",
    content: "Enhance your self-service capabilities for 24/7 support.",
  },
];

export default function ScrollBySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerElement = containerRef.current;
    const containerRect = containerElement.getBoundingClientRect();
    const containerTop = containerRect.top;
    const windowHeight = window.innerHeight;

    // Calculate which section should be active based on scroll position
    const scrolled = Math.max(0, -containerTop);
    const sectionHeight = windowHeight;
    const newActiveSection = Math.min(
      Math.floor(scrolled / sectionHeight),
      sections.length - 1,
    );

    setActiveSection(newActiveSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getSectionTransform = (index: number) => {
    const isActive = index === activeSection;
    const isPassed = index < activeSection;
    const isFuture = index > activeSection;

    if (isPassed) {
      // Sections that have been viewed stack at the top with small offset
      const stackOffset = (activeSection - index) * 40; // Visible stacking offset
      return {
        y: `-${stackOffset}px`,
        scale: 0.95, // Slightly smaller to show stacking
        zIndex: sections.length - index, // Higher z-index for sections further back
        opacity: 0.8, // Slightly transparent to show depth
      };
    } else if (isActive) {
      // Current active section
      return {
        y: 0,
        scale: 1,
        zIndex: sections.length + 10,
        opacity: 1,
      };
    } else if (isFuture) {
      // Future sections start from below
      return {
        y: "100vh",
        scale: 1,
        zIndex: index,
        opacity: 0,
      };
    }

    return { y: 0, scale: 1, zIndex: 1, opacity: 1 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gray-100 text-gray-900"
      style={{ height: `${sections.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen">
        {sections.map((section, index) => {
          const transform = getSectionTransform(index);

          return (
            <motion.div
              key={index}
              initial={{ y: "100vh", opacity: 0, scale: 0.9 }}
              animate={{
                y: transform.y,
                scale: transform.scale,
                opacity: transform.opacity,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{ zIndex: transform.zIndex }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white shadow-lg"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="px-8 py-12 text-center"
              >
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-800">
                  {section.title}
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                  {section.content}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
