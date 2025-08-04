import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const regionsData = [
  { title: "Top Comment 1", body: "Down Comment 1" },
  { title: "Top Comment 2", body: "Down Comment 2" },
  { title: "Top Comment 3", body: "Down Comment 3" },
  { title: "Top Comment 4", body: "Down Comment 4" },
  { title: "Top Comment 5", body: "Down Comment 5" },
];

export default function GsapAccordionScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const regionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const regions = gsap.utils.toArray(regionRefs.current);

    if (regions.length === 0) return;

    // Separate first, middle, last
    const first = regions[0] as HTMLDivElement;
    const last = regions[regions.length - 1] as HTMLDivElement;
    const middle = regions.slice(1, -1);

    // initialize visibility
    gsap.set(regions, { display: "none", autoAlpha: 1 });
    gsap.set(first, { display: "block", autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 0.5,
        start: "top top",
        end: "bottom bottom+100%",
        pin: true,
        markers: false, // set to true for debugging
      },
    });

    // hide first
    tl.to(first, { autoAlpha: 1, display: "none", duration: 1 });

    // show/hide middle with stagger (mimic your yoyo repeat logic)
    if (middle.length) {
      tl.to(
        middle,
        {
          display: "block",
          marginTop: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: {
            each: 2,
            yoyo: true,
            repeat: 1,
            // onComplete will hide after yoyo repeat automatically because of yoyo
          },
        },
        "<",
      );
    }

    // finally show last
    tl.to(last, { display: "block", marginTop: 0, autoAlpha: 1, duration: 1 });

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full py-40 text-white">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* left: text sequence */}
          <div className="flex-1">
            {regionsData.map((r, i) => (
              <div
                key={i}
                className="accordion overflow-hidden rounded-t-2xl shadow-xl not-first:-mt-5"
              >
                <div
                  className="rounded-t-2xl border border-gray-700 bg-gray-500 p-6"
                  aria-expanded="false"
                >
                  <h1 className="mb-2 text-xl font-bold">{r.title}</h1>
                  <div
                    role="region"
                    className="region"
                    ref={(el) => {
                      regionRefs.current[i] = el;
                    }}
                  >
                    <p className="h-[800px] text-sm">{r.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* right placeholder for image / side content */}
        </div>
      </div>
    </div>
  );
}
