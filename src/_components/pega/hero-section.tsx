import { motion } from "motion/react";
import VideoPlayer from "~/_components/pega/video/video-player";
import { Button } from "~/_components/ui/button";

const HeroCards = [
  {
    name: "Intelligent Automation",
    description:
      "Streamline processes with AI-driven workflows that adapt to customer needs",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ), // Example icon, replace with actual icon
  },
  {
    name: "Customer Insights",
    description:
      "Gain actionable insights from customer interactions using advanced analytics",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ), // Example icon, replace with actual icon
  },
  {
    name: "Omni-Channel Support",
    description: "Provide seamless support across all customer touchpoints",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ), // Example icon, replace with actual icon
  },
];

function HeroSection() {
  return (
    <>
      <motion.div
        className="max-w-xl space-y-8 text-center text-blue-900"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.h1
            className="text-5xl leading-tight font-bold lg:text-6xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            AI-powered customer service
          </motion.h1>

          <motion.p
            className="text-xl leading-relaxed text-gray-400 lg:text-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Our software optimizes workflows and interactions across the entire
            customer lifecycle
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center space-x-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="lg"
              className="bg-orange-500 px-8 py-3 text-lg text-white hover:bg-orange-600"
            >
              Get Started
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-white-100 border-black px-8 py-3 text-lg text-blue-900"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-12 flex justify-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <VideoPlayer controls={true} />
      </motion.div>

      {/* Additional Features Section */}
      <motion.div
        className="mt-24 grid grid-cols-1 gap-8 text-blue-900 md:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        {HeroCards.map((card, index) => (
          <motion.div
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6 + index * 0.2,
              delay: 0.1 + index * 0.2,
            }}
            whileHover={{ y: -5 }}
            key={card.name}
          >
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {card.icon}
            </motion.div>
            <h3 className="text-xl font-semibold">{card.name}</h3>
            <p className="text-gray-300">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

export default HeroSection;
