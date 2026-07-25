import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [showTop, setShowTop] = useState(true);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔶 Top Announcement */}
      {showTop && (
        <div className="bg-orange-500 text-white text-sm px-4 py-2 flex justify-between items-center">
          <p className="mx-auto text-center font-semibold text-xs md:text-base">
            No 1 Cracker Shop in Sivakasi. Best crackers at reasonable prices!
          </p>
          <button onClick={() => setShowTop(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ⚪ Navbar */}
      <nav className="bg-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
              🎆
            </div>
            <h1 className="text-orange-500 font-bold text-lg">
              Pyro <span className="text-sm">Town</span>
            </h1>
          </div>

          {/* 🖥️ Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <a href="#">Home</a>
            <a href="#">Estimate</a>
            <a href="#">Payment Info</a>
            <a href="#">About</a>
            <a href="#contact">Contact</a>

            <button className="bg-orange-500 text-white px-4 py-2 rounded-full">
              Get Estimate
            </button>
          </div>

          {/* 📱 Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden border p-2 rounded-md"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white px-4 py-4 space-y-4 shadow-md">
            <a className="block">Home</a>
            <a className="block">Estimate</a>
            <a className="block">Payment Info</a>
            <a className="block">About</a>
            <a className="block">Contact</a>

            <button className="w-full bg-orange-500 text-white py-2 rounded-full">
              Get Estimate
            </button>
          </div>
        )}
      </nav>

      {/* 🔶 Shipping Info Bar */}
      <div className="bg-orange-500 text-white text-center px-4 py-3 text-xs sm:text-sm leading-relaxed">
        <p className="font-semibold">Shipping Information -</p>
        <p>
          Shipping charges will be calculated during checkout based on your location.
        </p>
        <p className="hidden sm:block">
          All shipping payments will be made directly to shipping partners.
        </p>
      </div>
    </>
  );
}