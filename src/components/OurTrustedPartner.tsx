import { assetUrl } from "../api/client";
import type { TrustedPartner } from "../types";

export default function OurTrustedPartner({
  partners,
}: {
  partners: TrustedPartner[];
}) {
  if (partners.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-12 tracking-wide">
        Our Trusted Partners
      </h2>
      <div className="flex flex-wrap items-center justify-center px-6 md:px-12">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white gap-5 shadow-lg rounded-xl p-5 m-5 md:p-10 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={assetUrl(partner.image)}
              alt={partner.alt}
              className="w-40 h-50 md:w-56 object-contain mx-auto"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
