const Hero = () => {
  return (
    <div className="relative overflow-hidden min-h-screen flex items-center">
      {/* Full-bleed atmospheric image — blurred, desaturated, low opacity */}
      <div className="absolute inset-0 z-0">
        <img
          src="/music.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.07] blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_50%_40%,rgba(180,120,40,0.08),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 relative z-10 w-full text-center flex flex-col items-center">
        <div className="max-w-2xl flex flex-col items-center">
          <h1 className="reveal-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white" style={{ "--stagger": "0ms" }}>
            Music, <span className="text-amber-700">without limits.</span>
          </h1>

          <p
            className="reveal-hero mt-8 max-w-xl text-lg text-neutral-400 leading-relaxed"
            style={{ textWrap: "balance", "--stagger": "120ms" }}
          >
            Every song you love, ready to play instantly.
            <span className="block mt-2 text-neutral-500">
              Free forever
            </span>
          </p>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 flex items-center justify-center blur-sm opacity-40">
            <div className="w-64 h-64 bg-amber-800 rounded-full"></div>
          </div>
          <div className="relative flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}music.jpg`}
              alt="Music visualization"
              className="reveal-hero shadow-xl max-w-1.5 md:max-w-md"
              style={{ "--stagger": "280ms" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom bleed into Features */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
};

export default Hero;
