"use client";

import * as motion from "motion/react-client";
import HeroSection from "~/_components/pega/hero-section";
import GsapAccordionScroll from "~/_components/pega/scroll/gsap-scroll-accordion";
import ScrollBySection from "~/_components/pega/scroll/scroll-by-section";
import ScrollCard from "~/_components/pega/scroll/scroll-card";

export default function PegaDemoPage() {
  return (
    <motion.div
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Content */}
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-12 lg:px-12">
        <HeroSection />
        {/* <SnapScroll />
        <ParallaxText baseVelocity={5}>
          Experience the Future of Customer Service
        </ParallaxText>
        <ScrollTriggered />
        <TestimonialCarousel /> */}
        <ScrollCard />
        <ScrollBySection />
        {/* <ScrollAccordion /> */}
        {/* <AccordionOnScroll /> */}
        <GsapAccordionScroll />
      </div>
    </motion.div>
  );
}
