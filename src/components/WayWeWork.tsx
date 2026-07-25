import { useState } from "react";
import { motion } from "framer-motion";
import waywework from "../assets/way-we-work.webp";

const steps = [
  {
    title: "Curating Quality Products",
    desc: "We carefully select a diverse range of high-quality, safe, and eco-friendly crackers from trusted manufacturers.",
  },
  {
    title: "Ensuring Safety & Compliance",
    desc: "Before any product reaches our shelves, we verify that it complies with all safety regulations and standards.",
  },
  {
    title: "Getting Your Crackers",
    desc: "Visit our store to explore our wide selection of crackers. Our team is ready to assist you in finding the perfect options for your celebration.",
  },
  {
    title: "Order Confirmation & Payment",
    desc: "After placing your order, please contact us directly to confirm it. We will then share the payment details with you, offering multiple payment options for your convenience.",
  },
  {
    title: "Delivery & Charges",
    desc: "We offer flexible delivery options with reliable partners. Delivery charges will be applied based on your location and order size.",
  },
];

export default function WayWeWork() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-gray-100 py-10 text-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-4 md:px-10">
        {/* LEFT SIDE IMAGE */}
        <div className="relative">
          <img
            src={waywework}
            alt="process"
            className="w-full max-w-md mx-auto"
          />

        </div>
        <div>
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold">
            The Way We Work
          </h2>
          <p className="text-gray-600 mt-2 mb-8">
            Five steps is all it takes to elevate your Diwali celebration
          </p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 md:gap-6 px-4 mb-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center">

                {/* Circle */}
                <button
                  onClick={() => setActive(i)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full font-bold transition
                ${i === active
                      ? "bg-orange-500 text-white scale-110"
                      : "bg-blue-100 text-black hover:bg-blue-200"
                    }`}
                >
                  {i + 1}
                </button>

                {/* Line */}
                {i !== steps.length - 1 && (
                  <div className="w-6 md:w-10 h-[2px] bg-gray-400 mx-1 md:mx-2"></div>
                )}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="grid grid-cols-5 text-xs md:text-sm mb-8 px-4">
            {steps.map((step, i) => (
              <p key={i} className={i === active ? "font-semibold" : ""}>
                {step.title}
              </p>
            ))}
          </div>

          {/* Dynamic Content */}
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