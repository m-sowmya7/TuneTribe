import { useScrollReveal } from "../../hooks/useScrollReveal";

const Footer = () => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <footer className="relative overflow-hidden bg-black pt-16 sm:pt-20 lg:pt-24">
      <div
        ref={ref}
        className={`relative z-10 flex justify-center px-4 sm:px-6 ${isVisible ? "reveal" : "opacity-0"}`}
      >
        <h1
          className="
            select-none
            whitespace-nowrap
            font-serif
            font-normal
            leading-[1.05]
            tracking-tight
            text-amber-700
          "
          style={{
            fontSize: "clamp(4.5rem, 18vw, 20rem)",
            maskImage:
              "linear-gradient(to bottom, black 10%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 10%, transparent 100%)",
          }}
        >
          TuneTribe
        </h1>
      </div>

      <div
        className="h-20 sm:h-28 md:h-36 lg:h-40 w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='7'%3E%3Crect x='2' y='2' width='3' height='3' rx='0.5' fill='%23B45309'/%3E%3C/svg%3E")`,
          backgroundSize: "8px 8px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />
    </footer>
  );
};

export default Footer;
