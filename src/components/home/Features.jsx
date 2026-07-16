import { Search, ListMusic, PanelBottom, Flame } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const features = [
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Instantly discover songs, artists, and albums with fast, accurate search.",
  },
  {
    icon: ListMusic,
    title: "Smart Queue",
    description:
      "Build your listening queue and let autoplay keep the music going without interruption.",
  },
  {
    icon: PanelBottom,
    title: "Mini Player",
    description:
      "Browse trending tracks and albums while keeping playback controls within easy reach.",
  },
  {
    icon: Flame,
    title: "Trending & Latest",
    description:
      "Explore trending tracks and newly released albums to discover your next favorite song.",
  },
];

const Features = () => {
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <div id="features" className="bg-black py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div
          ref={headingRef}
          className={`text-center mb-16 ${headingVisible ? "reveal" : "opacity-0"}`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight"
            style={{ textWrap: "balance" }}
          >
            Why TuneTribe?
          </h2>
          <p
            className="text-neutral-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed"
            style={{ textWrap: "pretty" }}
          >
            A minimal, focused music experience — nothing you don&apos;t need.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800/50 rounded-xl overflow-hidden"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-black p-7 sm:p-8 group hover:bg-neutral-900/50 transition-colors duration-200 ${gridVisible ? "reveal" : "opacity-0"}`}
                style={{ "--stagger": `${index}` }}
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5 group-hover:border-neutral-700 transition-colors">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-white text-base font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
