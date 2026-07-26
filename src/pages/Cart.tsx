import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../api/client";

export default function Cart() {
  const { lines, totalQty, totalAmount, setQty, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 pb-12">
        <Link
          to="/estimate"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 mb-4"
        >
          <ArrowLeft size={16} /> Back to price list
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Your Cart
        </h1>

        {lines.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 shadow-sm">
            <ShoppingBag className="mx-auto mb-3 text-gray-300" size={40} />
            <p>Your cart is empty.</p>
            <Link
              to="/estimate"
              className="inline-block mt-4 bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600"
            >
              Browse crackers
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {lines.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
                >
                  <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{product.discountPrice} per {product.per}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setQty(product, qty - 1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(product, qty + 1)}
                      aria-label={`Increase quantity of ${product.name}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="w-16 text-right font-semibold text-gray-800 shrink-0">
                    ₹{qty * product.discountPrice}
                  </p>
                  <button
                    onClick={() => setQty(product, 0)}
                    aria-label={`Remove ${product.name} from cart`}
                    className="text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 mt-6 shadow-sm">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Total items</span>
                <span>{totalQty}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total amount</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={clearCart}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm hover:bg-gray-50"
                >
                  Clear cart
                </button>
                <button
                  onClick={() => navigate("/payment")}
                  className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-full text-sm transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
