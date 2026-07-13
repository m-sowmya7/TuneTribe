import { Navbar, Hero, Features, Pricing, Footer } from "../components";

function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

export default LandingPage