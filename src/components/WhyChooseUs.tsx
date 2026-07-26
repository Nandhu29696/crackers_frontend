import { motion } from "framer-motion";
import { getIcon } from "../utils/icons";
import type { WhyChooseUsItem } from "../types";

export default function WhyChooseUs({ items }: { items: WhyChooseUsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-10 bg-gray-100 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Why Choose Us</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-4 md:px-10">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center 
                              rounded-[40%] border-2 border-red-700 text-red-700 
                              shadow-sm bg-white">
                <Icon size={40} />
              </div>
              <p className="mt-3 text-sm md:text-base font-medium text-gray-700">
                {item.title}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
