import { Search, Music, Smartphone, Moon } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Powerful Search",
      description:
        "Find any song, artist or album with our lightning-fast search powered by Spotify API.",
    },
    {
      icon: Music,
      title: "Preview Tracks",
      description:
        "Listen to song previews directly in your browser before adding to your library.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description:
        "Enjoy TuneTribe on any device with our fully responsive and adaptive interface.",
    },
    {
      icon: Moon,
      title: "Dark Mode",
      description:
        "Easy on the eyes with our carefully crafted dark theme optimized for music lovers.",
    },
  ];

  return (
    <div id="features" className="bg-neutral-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose TuneTribe?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover a new way to experience music with our feature-rich
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-neutral-800 p-6 rounded-xl transition-all hover:translate-y-[-5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] duration-300"
            >
              <div className="text-4xl mb-4"><feature.icon /></div>
              <h3 className="text-white text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;