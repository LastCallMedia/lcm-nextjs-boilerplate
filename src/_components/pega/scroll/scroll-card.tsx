import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Card, CardContent } from "~/_components/ui";

const cards = [
  { name: "Card 1", description: "Description for Card 1" },
  { name: "Card 2", description: "Description for Card 2" },
  { name: "Card 3", description: "Description for Card 3" },
];

function ScrollCard() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log("Scroll position:", latest);
    console.log(scrollY.get());
  });
  //   const scale = useTransform(scrollY, [1020, 2000], [1, 0.5]);
  //   const opacity = useTransform(scrollY, [1020, 2000], [1, 0]);
  const cardTimeline = cards.map((_, i) => {
    const start = 1390 + i * window.innerHeight + i * 200; // Adjust start position based on index
    const end = 1390 + (i + 1) * window.innerHeight;
    return [start, end];
  });
  const timeline = [[1020, 1500], ...cardTimeline];
  const animation = timeline.map((data) => ({
    // eslint-disable-next-line react-hooks/rules-of-hooks
    scale: useTransform(scrollY, data, [1, 0.5]),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    opacity: useTransform(scrollY, data, [1, 0]),
  }));
  return (
    <div ref={targetRef} className="bg-background relative">
      <motion.div
        style={{ scale: animation[0]?.scale, opacity: animation[0]?.opacity }}
        className="sticky top-0 flex h-[500px] items-end overflow-clip px-36 text-8xl text-black uppercase lg:text-[160px] lg:leading-[140px]"
      >
        <h1 className="h-max w-full">
          our <br />
          <span className="lg-ml-52 ml-20">software</span>
        </h1>
      </motion.div>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          style={{
            opacity: animation[i + 1]?.opacity,
          }}
          className="sticky top-0 h-dvh w-full py-20"
        >
          <Card className="h-full bg-gray-200 shadow-md">
            <CardContent>
              <p>{card.name}</p>
            </CardContent>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default ScrollCard;
