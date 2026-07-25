import brandimg from "../assets/brand3.webp";
import brandimg5 from "../assets/brand5.webp";

export default function OurTrustedPartner() {
    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12 tracking-wide">
                Our Trusted Partners
            </h2>
            <div className="flex items-center justify-center px-6 md:px-12">
                <div className="bg-white gap-5 shadow-lg rounded-xl p-5 m-5 md:p-10 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <img
                        src={brandimg}
                        alt="Partner 1"
                        className="w-40 h-50 md:w-56 object-contain mx-auto"
                    />
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <img
                        src={brandimg5}
                        alt="Partner 1"
                        className="w-40 md:h-45 md:w-56 object-contain mx-auto"
                    />
                </div>
            </div>
        </section>
    );
}
