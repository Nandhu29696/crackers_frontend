import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [showTop, setShowTop] = useState(true);
  const [open, setOpen] = useState(false);
  const { totalQty } = useCart();

  return (
    <>
      {/* 🔶 Top Announcement */}
      {showTop && (
        <div className="bg-orange-500 text-white text-sm px-4 py-2 flex justify-between items-center">
          <p className="mx-auto text-center font-semibold text-xs md:text-base">
            No 1 Cracker Shop in Sivakasi. Best crackers at reasonable prices!
          </p>
          <button onClick={() => setShowTop(false)} aria-label="Dismiss announcement">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ⚪ Navbar */}
      <nav className="bg-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
              🎆
            </div>
            <h1 className="text-orange-500 font-bold text-lg">
              Pyro <span className="text-sm">Town</span>
            </h1>
          </Link>

          {/* 🖥️ Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/">Home</Link>
            <Link to="/estimate">Estimate</Link>
            <span
              className="text-gray-400 cursor-not-allowed"
              title="Coming soon"
            >
              Payment Info
            </span>
            <span
              className="text-gray-400 cursor-not-allowed"
              title="Coming soon"
            >
              About
            </span>
            <a href="/#contact">Contact</a>

            <Link to="/cart" className="relative" aria-label="View cart">
              <ShoppingCart size={22} />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalQty}
                </span>
              )}
            </Link>

            <Link
              to="/estimate"
              className="bg-orange-500 text-white px-4 py-2 rounded-full"
            >
              Get Estimate
            </Link>

            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-full"
            >
              Admin Login
            </Link>
          </div>

          {/* 📱 Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden border p-2 rounded-md"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* 📱 Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white px-4 py-4 space-y-4 shadow-md">
            <Link to="/" className="block" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/estimate" className="block" onClick={() => setOpen(false)}>Estimate</Link>
            <span className="block text-gray-400 cursor-not-allowed" title="Coming soon">Payment Info</span>
            <span className="block text-gray-400 cursor-not-allowed" title="Coming soon">About</span>
            <a href="/#contact" className="block" onClick={() => setOpen(false)}>Contact</a>

            <Link
              to="/estimate"
              className="block w-full text-center bg-orange-500 text-white py-2 rounded-full"
              onClick={() => setOpen(false)}
            >
              Get Estimate
            </Link>
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