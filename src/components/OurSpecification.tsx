import { motion } from "framer-motion";
import {
  Award,
  Sparkles,
  Star,
  Tag,
  WandSparkles,
  Rocket,
} from "lucide-react";

const specs = [
  {
    icon: <Award size={28} />,
    title: "Colorful crackers",
    desc: "Our crackers are not just a treat for the taste buds—they’re a feast for the eyes too! Available in a variety of dazzling colors, each cracker is packaged in a stylish and catchy design.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Innovative crackers",
    desc: "At your request, we can create crackers that stand out from the competition, offering something truly unique. Whether you're looking for different shapes or vibrant color options.",
  },
  {
    icon: <Star size={28} />,
    title: "Supreme quality",
    desc: "We take pride in offering only the highest quality crackers, ensuring that every purchase is a delightful experience for our customers.",
  },
  {
    icon: <WandSparkles size={28} />,
    title: "Inspiring crackers",
    desc: "Our crackers attract a diverse customer base and set a benchmark for others. Known for safety, affordability, and premium quality.",
  },
  {
    icon: <Rocket size={28} />,
    title: "Fancy item",
    desc: "We promote a range of fancy crackers that deliver extraordinary experiences and dazzling visuals for customers.",
  },
  {
    icon: <Tag size={28} />,
    title: "Affordable price",
    desc: "We regularly update our price list to ensure the best value without compromising on quality.",
  },
];

export default function OurSpecification() {
  return (
    <section className="py-12 bg-gray-100 text-center">
      
      {/* Title */}
      <h2 className="text-2xl md:text-4xl font-bold mb-10 tracking-wide">
        OUR SPECIFICATION
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 md:px-16">
        {specs.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon Circle */}
            <div className="w-14 h-14 flex items-center justify-center 
                            bg-orange-500 text-white rounded-full shadow-md">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
              {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-600 max-w-xs leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}