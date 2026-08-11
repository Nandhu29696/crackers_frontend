import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Search, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { apiGet, assetUrl } from "../api/client";
import type { Category, Product } from "../types";

export default function Estimate() {
  const { lines, totalQty, totalAmount, setQty, getQty } = useCart();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Category[]>("/api/categories"),
      apiGet<Product[]>("/api/products"),
    ])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(
          prods.map((prod) => {
            const categoryId =
              typeof prod.categoryId === "string"
                ? prod.categoryId
                : prod.categoryId && typeof prod.categoryId === "object"
                ? prod.categoryId.id || prod.categoryId._id || ""
                : "";

            return {
              ...prod,
              categoryId,
            };
          })
        );
      })
      .catch(() =>
        setLoadError(
          "Could not load the price list. Is the API server running?"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const categorized = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories
      .map((cat) => ({
        cat,
        items: products
          .filter((p) => p.categoryId === cat.id)
          .filter(
            (p) =>
              !q ||
              p.name.toLowerCase().includes(q) ||
              p.nameTa.includes(search.trim())
          ),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, products, search]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-28">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 mb-4"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Build Your Estimate
          </h1>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:border-orange-400"
          >
            <ShoppingCart size={16} />
            Cart
            {totalQty > 0 && (
              <span className="bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
        <p className="text-gray-600 mt-1 mb-6 text-sm md:text-base">
          Pick the crackers you're interested in and quantities below, then
          check out to get your estimate and pay a demo deposit online.
        </p>

        <div className="relative mb-6 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crackers (e.g. sparklers, rocket)"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        {!search && !loading && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="shrink-0 text-xs md:text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full hover:border-orange-400 hover:text-orange-600 transition whitespace-nowrap"
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-400 gap-2">
            <Loader2 className="animate-spin" /> Loading price list...
          </div>
        )}

        {loadError && (
          <div className="text-center py-16 text-red-500">{loadError}</div>
        )}

        {!loading && !loadError && categorized.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No crackers match "{search}". Try a different search term.
          </div>
        )}

        <div className="space-y-10">
          {categorized.map(({ cat, items }) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                {cat.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{cat.nameTa}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => {
                  const qty = getQty(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl p-3 flex items-center gap-3 border transition ${
                        qty > 0
                          ? "border-orange-400 shadow-sm"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={assetUrl(item.image)}
                        alt={item.name}
                        loading="lazy"
                        className="w-14 h-14 object-cover rounded-lg shrink-0 bg-gray-100"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          per {item.per}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="line-through text-gray-400 mr-1.5">
                            ₹{item.price}
                          </span>
                          <span className="font-bold text-orange-600">
                            ₹{item.discountPrice}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setQty(item, qty - 1)}
                          disabled={qty === 0}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-30 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(item, qty + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-40">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500">
                {totalQty} {totalQty === 1 ? "item" : "items"} · {lines.length}{" "}
                {lines.length === 1 ? "product" : "products"}
              </p>
              <p className="text-lg font-bold text-gray-800">₹{totalAmount}</p>
            </div>
            <Link
              to="/cart"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
