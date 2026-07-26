import { motion } from "framer-motion";
import { getIcon } from "../utils/icons";
import type { SpecificationItem } from "../types";

export default function OurSpecification({
  items,
}: {
  items: SpecificationItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-gray-100 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-10 tracking-wide">
        OUR SPECIFICATION
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 md:px-16">
        {items.map((item, index) => {
          const Icon = getIcon(item.icon);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 flex items-center justify-center 
                              bg-orange-500 text-white rounded-full shadow-md">
                <Icon size={28} />
              </div>
              <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-xs leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
