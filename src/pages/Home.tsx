import { useEffect, useState } from "react";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import WhyChooseUs from "../components/WhyChooseUs";
import OurSpecification from "../components/OurSpecification";
import WayWeWork from "../components/WayWeWork";
import OurTrustedPartner from "../components/OurTrustedPartner";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import badgeImg from "../assets/pricelist.webp";
import pricelist from "../assets/PRICE_LIST_2025-3.pdf";
import { apiGet } from "../api/client";
import type { HomeContent } from "../types";

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    apiGet<HomeContent>("/api/content")
      .then(setContent)
      .catch(() => setContent(null));
  }, []);

  return (
    <>
      <div className="bg-gray-300 min-h-screen flex justify-center">
        <div className="w-full bg-white">
          <Header />
          <HeroCarousel banners={content?.banners ?? []} />
          <WhyChooseUs items={content?.whyChooseUs ?? []} />
          <OurSpecification items={content?.specifications ?? []} />
          <WayWeWork
            steps={content?.wayWeWork ?? []}
            image={content?.wayWeWorkImage}
          />
          <OurTrustedPartner partners={content?.trustedPartners ?? []} />
          <ContactSection contact={content?.contact} />
          <Footer contact={content?.contact} />
        </div>
        <img
          src={badgeImg}
          alt="Download Pricelist"
          onClick={() => window.open(pricelist, "_blank", "noopener,noreferrer")}
          className="fixed bottom-4 right-4 sm:right-6  
               w-16 sm:w-24 md:w-28 
               cursor-pointer  animate-bounce
               hover:scale-105 transition duration-300"/>
      </div>
    </>
  );
}
