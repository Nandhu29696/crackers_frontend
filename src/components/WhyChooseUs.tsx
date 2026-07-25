import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  IndianRupee,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <CheckCircle size={40} />,
    title: "Wide Variety",
  },
  {
    icon: <Truck size={40} />,
    title: "Bulk Orders",
  },
  {
    icon: <Sparkles size={40} />,
    title: "Quality Products",
  },
  {
    icon: <IndianRupee size={40} />,
    title: "Affordable Price",
  },
  {
    icon: <Package size={40} />,
    title: "Wide Variety",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-gray-100 text-center">
      
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        Why Choose Us
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-4 md:px-10">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            className="flex flex-col items-center"
          >
            {/* Icon Container */}
            <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center 
                            rounded-[40%] border-2 border-red-700 text-red-700 
                            shadow-sm bg-white">
              {item.icon}
            </div>

            {/* Text */}
            <p className="mt-3 text-sm md:text-base font-medium text-gray-700">
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}