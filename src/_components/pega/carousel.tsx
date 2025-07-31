import { motion } from "motion/react";

const testimonials = [
  {
    name: "Jenn Wade",
    company: "Elevance Health",
    quote: "What you're looking for is somebody to be there in that journey...",
    image: "/images/jenn.jpg",
    logo: "/logos/elevance.svg",
  },
  {
    name: "Nicola Bakermans",
    company: "Athora",
    quote:
      "Pega was the only single platform that seamlessly integrated CRM and BPM...",
    image: "/images/nicola.jpg",
    logo: "/logos/athora.svg",
  },
  {
    name: "Angus Sullivan",
    company: "Commonwealth Bank of Australia",
    quote: "We just did our 50 millionth next best conversation in person.",
    image: "/images/angus.jpg",
    logo: "/logos/commbank.svg",
  },
];

export default function TestimonialCarousel() {
  return (
    <div className="scroll-snap-x flex max-w-full gap-4 scroll-smooth px-4 py-8 whitespace-nowrap">
      {testimonials.map((item, index) => (
        <motion.div
          key={index}
          className="scroll-snap-start relative h-[500px] w-[280px] flex-shrink-0 overflow-hidden rounded-xl bg-black text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent px-4 py-6">
            <p className="text-sm">{item.name}</p>
            <p className="mb-2 text-xs text-gray-300">{item.company}</p>
            <button className="mb-3 self-start rounded-full bg-white px-4 py-1 text-sm font-semibold text-black">
              ▶ Watch video
            </button>
            <p className="mb-4 text-sm">{item.quote}</p>
            <img
              src={item.logo}
              alt={item.company + " logo"}
              className="w-24"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
