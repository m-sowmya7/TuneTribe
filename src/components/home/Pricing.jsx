import { Check, Sparkles } from "lucide-react";
import { GetStartedButton } from "../layout/Navbar";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Unlimited song searches",
      "Build your own queue",
      "Costs exactly nothing",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "$0",
    features: [
      "Everything in Free",
      "A fancier title",
      "Unlimited bragging rights",
    ],
    popular: true,
  },
  {
    name: "Family",
    price: "$0",
    features: [
      "Everything in Premium",
      "Bring your family along",
      "They'll still steal your headphones",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.05 });

  return (
    <section id="pricing" className="bg-black py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          ref={headingRef}
          className={`mb-16 text-center ${headingVisible ? "reveal" : "opacity-0"}`}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ textWrap: "balance" }}
          >
            Pricing
          </h2>

          <p
            className="mt-4 mx-auto max-w-sm text-sm sm:text-base leading-relaxed text-neutral-500"
            style={{ textWrap: "balance" }}
          >
            Choose wisely.
            <br />
            They all cost the same.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid gap-5 md:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-px transition-all duration-300 hover:-translate-y-1 ${gridVisible ? "reveal" : "opacity-0"} ${
                plan.popular
                  ? "bg-gradient-to-b from-amber-700 via-amber-700/40 to-amber-700/10"
                  : "bg-neutral-800"
              }`}
              style={{ "--stagger": `${index}` }}
            >
              <div className="flex h-full flex-col rounded-2xl bg-black p-7 lg:p-8">
                <div className="mb-6 flex h-6 items-center">
                  {plan.popular && (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-700" />
                      <span className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-700">
                        Recommended
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>

                <div className="mt-5 mb-10">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      {plan.price}
                    </span>

                    <span className="mb-1 text-neutral-500">forever</span>
                  </div>
                </div>

                <ul className="flex-1 space-y-5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-neutral-400"
                    >
                      <Check className="mt-[2px] h-4 w-4 shrink-0 text-amber-700" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.popular && (
                  <div className="mt-10 grid place-items-center">
                    <GetStartedButton />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
