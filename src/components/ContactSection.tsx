import { Phone, Mail, MapPin } from "lucide-react";
import type { HomeContent } from "../types";

const ContactSection = ({ contact }: { contact?: HomeContent["contact"] }) => {
  return (
    <div id="contact" className="w-full bg-gray-100 py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-6">Our Locations</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
          <iframe
            title="Sivakasi Location"
            src="https://maps.google.com/maps?q=Sivakasi&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

        <div className="  text-black rounded-xl p-6 flex flex-col justify-center shadow">
          <h3 className="text-2xl font-semibold mb-6 text-left bg-gray-700 text-white w-max px-4 py-2 rounded">
            Contact us
          </h3>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-full">
                <Phone size={20} />
              </div>
              <span className="text-lg">{contact?.phone ?? "+91 6380356788"}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-full">
                <Mail size={20} />
              </div>
              <span className="text-lg">
                {contact?.email ?? "crackerssivajothi@gmail.com"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-full">
                <MapPin size={20} />
              </div>
              <span className="text-lg">
                {contact?.address ?? "Paraipatti, Sattur Road, Sivakasi"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
