import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl } from "../api/client";
import type { Banner } from "../types";

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
    const [index, setIndex] = useState(0);
    const safeIndex = banners.length > 0 ? index % banners.length : 0;

    useEffect(() => {
        if (banners.length < 2) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) {
        return (
            <section className="relative w-full h-[160px] sm:h-[220px] md:h-[400px] overflow-hidden bg-gray-100" />
        );
    }

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % banners.length);
    };

    return (
        <section className="relative w-full h-[160px] sm:h-[220px] md:h-[400px] overflow-hidden bg-gray-100">
            <AnimatePresence mode="wait">
                <motion.img
                    key={banners[safeIndex].id}
                    src={assetUrl(banners[safeIndex].image)}
                    alt="banner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover rounded-md"
                />
            </AnimatePresence>
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full text-lg shadow">
                ‹
            </button>

            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 px-2 py-1 rounded-full text-lg shadow">
                ›
            </button>

            <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {banners.map((banner, i) => (
                    <div
                        key={banner.id}
                        className={`w-2 h-2 rounded-full ${i === safeIndex ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                ))}
            </div>
        </section>
    );
}
