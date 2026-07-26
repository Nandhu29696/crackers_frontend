import { useEffect, useState } from "react";
import { adminGet, adminJson } from "../../api/client";
import type { Order } from "../../types";

const STATUS_OPTIONS: Order["status"][] = [
  "pending_payment",
  "paid",
  "fulfilled",
  "cancelled",
];

const STATUS_COLORS: Record<Order["status"], string> = {
  pending_payment: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  fulfilled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    adminGet<Order[]>("/api/orders")
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      const updated = await adminJson<Order>(`/api/orders/${id}/status`, "PATCH", {
        status,
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update order");
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading orders...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (orders.length === 0)
    return <p className="text-gray-500 text-sm">No orders yet.</p>;

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <p className="font-mono text-xs text-gray-500">{order.id}</p>
              <p className="font-semibold text-gray-800">
                {order.customer.name} · {order.customer.phone}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
              >
                {order.status.replace("_", " ")}
              </span>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value as Order["status"])
                }
                className="text-xs border border-gray-300 rounded-md px-2 py-1"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {order.customer.address && (
            <p className="text-xs text-gray-500 mb-2">{order.customer.address}</p>
          )}

          <div className="text-sm text-gray-600 space-y-0.5 mb-2">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.lineTotal}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-100 pt-2">
            <span>{order.totalQty} items</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Placed {new Date(order.createdAt).toLocaleString("en-IN")}
            {order.paidAt &&
              ` · Paid ${new Date(order.paidAt).toLocaleString("en-IN")}`}
          </p>
        </div>
      ))}
    </div>
  );
}
