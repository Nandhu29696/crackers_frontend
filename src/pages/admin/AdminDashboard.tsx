import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, ExternalLink } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import ProductsTab from "./ProductsTab";
import BannersTab from "./BannersTab";
import ContentTab from "./ContentTab";
import OrdersTab from "./OrdersTab";

const TABS = [
  { id: "orders", label: "Orders" },
  { id: "products", label: "Products" },
  { id: "banners", label: "Banners & Partners" },
  { id: "content", label: "Homepage Content" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("orders");
  const { logout, username } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-800">Pyro Town Admin</h1>
          <p className="text-xs text-gray-500">Signed in as {username}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1"
          >
            View site <ExternalLink size={14} />
          </Link>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 px-4 md:px-8 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
              tab === t.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="p-4 md:p-8">
        {tab === "orders" && <OrdersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "banners" && <BannersTab />}
        {tab === "content" && <ContentTab />}
      </main>
    </div>
  );
}
