import { useState } from "react";
import { motion } from "framer-motion";
import { assetUrl } from "../api/client";
import type { WayWeWorkStep } from "../types";

export default function WayWeWork({
  steps,
  image,
}: {
  steps: WayWeWorkStep[];
  image?: string;
}) {
  const [active, setActive] = useState(0);

  if (steps.length === 0) return null;

  return (
    <section className="bg-gray-100 py-10 text-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 md:px-10">
        <div className="relative">
          {image && (
            <img
              src={assetUrl(image)}
              alt="process"
              className="w-full max-w-md mx-auto"
            />
          )}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">The Way We Work</h2>
          <p className="text-gray-600 mt-2 mb-8">
            Five steps is all it takes to elevate your Diwali celebration
          </p>

          <div
            className="flex items-center justify-center gap-2 md:gap-6 px-4 mb-6"
          >
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setActive(i)}
                  aria-label={`Step ${i + 1}: ${step.title}`}
                  aria-pressed={i === active}
                  className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition
                ${i === active
                      ? "bg-orange-500 text-white scale-110"
                      : "bg-blue-100 text-black hover:bg-blue-200"
                    }`}
                >
                  {i + 1}
                </button>
                {i !== steps.length - 1 && (
                  <div className="w-6 md:w-10 h-[2px] bg-gray-400 mx-1 md:mx-2"></div>
                )}
              </div>
            ))}
          </div>

          <div
            className="grid text-xs md:text-sm mb-8 px-4"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            {steps.map((step, i) => (
              <p key={step.id} className={i === active ? "font-semibold" : ""}>
                {step.title}
              </p>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl mx-auto px-4"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              {steps[active].title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              {steps[active].desc}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
