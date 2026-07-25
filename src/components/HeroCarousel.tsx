import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import banners from "../assets/bannerData";

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);

    // 🔥 Auto scroll every 3 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // ⬅️ ➡️ Controls
    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <section className="relative w-full h-[160px] sm:h-[220px] md:h-[400px] overflow-hidden bg-gray-100">
            {/* Slides */}
            <AnimatePresence>
                <img
                    key={banners[index].id}
                    src={banners[index].image}
                    alt="banner"
                    className="w-full h-full object-cover rounded-md"
                />
            </AnimatePresence>
            {/* ⬅️ Left Arrow */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full text-lg shadow">
                ‹
            </button>

            {/* ➡️ Right Arrow */}
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full text-lg shadow">
                ›
            </button>
            {/* 🎯 Download Pricelist Badge */}
            
            {/* Dots */}
            <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {banners.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === index ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                ))}
            </div>
        </section>
    );
}