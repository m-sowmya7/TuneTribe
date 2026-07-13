import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* <div className="absolute inset-0 z-0"> */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-900 opacity-95"></div> */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,53,15,0.3),transparent)]"></div> */}
      {/* </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Your Perfect <span className="text-amber-700">Sound</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Search, stream, and enjoy millions of tracks from your favorite
            artists. Experience music like never before with TuneTribe's
            immersive platform.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-amber-900 to-amber-700 hover:opacity-90 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300 ease-in-out shadow-[0_0_15px_rgba(146,64,14,0.5)]"
            >
              Start Listening
            </Link>
            <Link
              to="#features"
              className="bg-transparent border border-neutral-700 hover:border-neutral-500 text-white px-8 py-3 rounded-md text-lg font-medium transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 flex items-center justify-center blur-sm opacity-40">
            <div className="w-64 h-64 bg-amber-800 rounded-full"></div>
          </div>
          <div className="relative flex justify-center">
            <img
              src="./mucis.jpg"
              alt="Music visualization"
              className="shadow-xl max-w-1.5 md:max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;