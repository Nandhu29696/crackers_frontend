import React from "react";
import {
    Facebook,
    Instagram,
    Youtube,
    X
} from "lucide-react";
import type { HomeContent } from "../types";

const Footer: React.FC<{ contact?: HomeContent["contact"] }> = ({ contact }) => {
    const phone = contact?.phone ?? "+91 6380356788";
    const email = contact?.email ?? "crackerssivajothi@gmail.com";
    const address = contact?.address ?? "Paraipatti, Sattur Road, Sivakasi";
    const whatsapp = contact?.whatsapp ?? "916380356788";
    return (
        <footer className="w-full bg-gray-100 pt-10">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 items-start">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        🔥
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-orange-500">Pyro</h2>
                        <p className="text-sm text-gray-600">Town</p>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-bold text-orange-500 mb-3">
                        Contact Us
                    </h3>
                    <p className="text-gray-700">Call us on</p>
                    <p className="font-semibold text-gray-900 mb-2">
                        {phone}
                    </p>

                    <p className="text-gray-700">Write to us at</p>
                    <p className="font-semibold text-gray-900">
                        {email}
                    </p>
                </div>

                {/* Address */}
                <div>
                    <h3 className="text-xl font-bold text-orange-500 mb-3">
                        Address
                    </h3>
                    <p className="text-gray-800 mb-3">
                        {address}
                    </p>

                    <a
                        href="#"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Track Your Order
                    </a>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Keep in Touch
                    </h3>

                    <div className="flex gap-3">
                        {[Facebook, Instagram, Youtube, X].map((Icon, index) => (
                            <div
                                key={index}
                                className="bg-orange-500 p-3 rounded-full text-white cursor-pointer hover:scale-110 transition"
                            >
                                <Icon size={18} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="max-w-7xl mx-auto px-4 mt-8 text-sm text-gray-700 leading-relaxed">
                <p>
                    As per 2018 Supreme Court Order, Online Sale of Firecrackers are NOT
                    permitted. We value our customers and at the same time, we respect the
                    jurisdiction. We request our customers to select your products in
                    Estimate Page to see your estimation and submit the required crackers
                    through the Get Estimate Button. We will contact you within 2 hrs and
                    confirm the order through phone call. Please add and submit your
                    enquiries and enjoy your Diwali with us. Our shop follows 100% legal &
                    statutory compliances and all our shops, go-downs are maintained as
                    per the explosive acts. We send the parcels through registered and
                    legal transport service providers.
                </p>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-900 text-center text-orange-500 py-4 mt-6">
                © 2026 pyrotown Crackers. All rights reserved
            </div>

            {/* WhatsApp Floating Button */}
            <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-5 left-5 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition"
            >
                💬 WhatsApp
            </a>
        </footer>
    );
};

export default Footer;