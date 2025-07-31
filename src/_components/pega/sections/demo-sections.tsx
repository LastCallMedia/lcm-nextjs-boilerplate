import { motion } from "motion/react";
// eslint-disable-next-line no-restricted-imports
import "./styles.css"; // make sure CSS from above is applied

export default function SnapScroll() {
  return (
    <div className="scroll-container mt-16">
      <motion.section
        className="section flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 * 1 }}
      >
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Grow Your Business with Clarity
        </h1>
        <p className="mb-8 text-lg text-gray-600 md:text-xl">
          Our platform helps you connect, automate, and scale faster than ever.
        </p>
        <button className="rounded-full bg-blue-600 px-6 py-3 text-lg text-white transition hover:bg-blue-700">
          Get Started
        </button>
      </motion.section>

      {/* Section 2: Features */}
      <motion.section
        className="section bg-gray-50 py-20"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 * 2 }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 text-center md:grid-cols-3">
          <div>
            <div className="mb-4 text-4xl text-blue-600">⚡</div>
            <h3 className="mb-2 text-xl font-semibold">Fast Integration</h3>
            <p className="text-gray-600">
              Plug into your workflow in minutes, not days.
            </p>
          </div>
          <div>
            <div className="mb-4 text-4xl text-green-600">🔒</div>
            <h3 className="mb-2 text-xl font-semibold">Secure & Reliable</h3>
            <p className="text-gray-600">
              Built with enterprise-grade security in mind.
            </p>
          </div>
          <div>
            <div className="mb-4 text-4xl text-purple-600">📈</div>
            <h3 className="mb-2 text-xl font-semibold">Scalable Results</h3>
            <p className="text-gray-600">
              Grow confidently with tools that scale with you.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Testimonial */}
      <motion.section
        className="section bg-white py-20"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 * 3 }}
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-6 text-xl text-gray-700 italic">
            “This platform changed the way we work. Productivity is up, and our
            clients love the experience.”
          </p>
          <div className="font-semibold text-gray-800">
            — Taylor Morgan, Product Lead at NovaTech
          </div>
        </div>
      </motion.section>
      {/* {sections.map((text, i) => (
        <motion.section
          key={i}
          className="section"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.1 * i }}
        >
          <h1>{text}</h1>
        </motion.section>
      ))} */}
    </div>
  );
}
