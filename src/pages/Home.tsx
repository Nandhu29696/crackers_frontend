import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import badgeImg from "../assets/pricelist.webp";
import WhyChooseUs from "../components/WhyChooseUs";
import OurSpecification from "../components/OurSpecification";
import WayWeWork from "../components/WayWeWork";
import pricelist from "../assets/PRICE_LIST_2025-3.pdf";
import OurTrustedPartner from "../components/OurTrustedPartner";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <div className="bg-gray-300 min-h-screen flex justify-center">
        <div className="w-full before: bg-white">
          <Header />
          <HeroCarousel />
          <WhyChooseUs />
          <OurSpecification />
          <WayWeWork />
          <OurTrustedPartner />
          <ContactSection />
          <Footer />
        </div>
        <img
          src={badgeImg}
          alt="Download Pricelist"
          onClick={() => window.open(pricelist, "_blank")}
          className="fixed bottom-4 sm:right-6  
               w-16 sm:w-24 md:w-28 
               cursor-pointer  animate-bounce
               hover:scale-105 transition duration-300"/>
      </div>
    </>
  );
} 