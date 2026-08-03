import { useEffect, useState } from "react";
import { adminGet, adminJson, apiGet } from "../../api/client";
import { generateInvoicePdf } from "../../utils/invoice";
import type { ContentResponse, Order, Product } from "../../types";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContentResponse["contact"] | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState({ name: "", phone: "", address: "" });
  const [editItems, setEditItems] = useState<Array<{ productId: string; qty: string; unitPrice: string }>>([]);
  const [fieldErrors, setFieldErrors] = useState<{
    customer: { name?: string; phone?: string };
    items: Array<{ productId?: string; qty?: string; unitPrice?: string }>;
  }>({ customer: {}, items: [] });

  const load = () => {
    setLoading(true);
    Promise.all([adminGet<Order[]>("/api/orders"), apiGet<Product[]>("/api/products")])
      .then(([orderData, productData]) => {
        setOrders(orderData);
        setProducts(productData);
      })
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

  const productMap = new Map(products.map((product) => [product.id, product]));
  const activeProducts = products.filter((product) => product.status);

  const startEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setSubmitError("");
    setEditCustomer({
      name: order.customer.name,
      phone: order.customer.phone,
      address: order.customer.address || "",
    });
    setEditItems(
      order.items.map((item) => ({
        productId: item.productId,
        qty: String(item.qty),
        unitPrice: String(item.unitPrice),
      }))
    );
    setFieldErrors({ customer: {}, items: order.items.map(() => ({})) });
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setSubmitError("");
    setEditCustomer({ name: "", phone: "", address: "" });
    setEditItems([]);
    setFieldErrors({ customer: {}, items: [] });
  };

  const validateDraft = () => {
    const next = {
      customer: {} as { name?: string; phone?: string },
      items: editItems.map(() => ({} as { productId?: string; qty?: string; unitPrice?: string })),
    };

    const phone = editCustomer.phone.trim();
    if (!editCustomer.name.trim()) next.customer.name = "Customer name is required";
    if (!phone) next.customer.phone = "Phone number is required";
    else if (!/^[0-9+\-\s]{7,15}$/.test(phone)) next.customer.phone = "Enter a valid phone number";

    editItems.forEach((item, index) => {
      if (!item.productId.trim()) next.items[index].productId = "Choose a product";

      const qty = Number(item.qty);
      if (!Number.isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
        next.items[index].qty = "Qty must be a whole number >= 1";
      }

      const price = Number(item.unitPrice);
      if (!Number.isFinite(price) || price < 0) {
        next.items[index].unitPrice = "Price must be 0 or more";
      }
    });

    const hasErrors =
      Boolean(next.customer.name || next.customer.phone) ||
      next.items.some((itemErr) => itemErr.productId || itemErr.qty || itemErr.unitPrice);

    setFieldErrors(next);
    return !hasErrors;
  };

  const clearItemError = (index: number, field: "productId" | "qty" | "unitPrice") => {
    setFieldErrors((prev) => ({
      ...prev,
      items: prev.items.map((itemErr, i) =>
        i === index ? { ...itemErr, [field]: undefined } : itemErr
      ),
    }));
  };

  const addItem = () => {
    setEditItems((prev) => [
      {
        productId: "",
        qty: "",
        unitPrice: "",
      },
      ...prev,
    ]);
    setFieldErrors((prev) => ({ ...prev, items: [{}, ...prev.items] }));
  };

  const removeItem = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
    setFieldErrors((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const saveEdit = async (orderId: string) => {
    if (editItems.length === 0) {
      setSubmitError("At least one line item is required");
      return;
    }

    if (!validateDraft()) return;

    try {
      setSubmitError("");
      setSavingOrderId(orderId);
      const updated = await adminJson<Order>(`/api/orders/${orderId}`, "PATCH", {
        customer: {
          name: editCustomer.name,
          phone: editCustomer.phone,
          address: editCustomer.address,
        },
        items: editItems.map((item) => ({
          productId: item.productId,
          qty: Number(item.qty),
          unitPrice: Number(item.unitPrice),
        })),
      });

      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      cancelEdit();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not save order changes");
    } finally {
      setSavingOrderId(null);
    }
  };

  const updateItemField = (index: number, field: "productId" | "qty" | "unitPrice", value: string) => {
    setEditItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (field === "productId") {
          const selected = productMap.get(value);
          return {
            ...item,
            productId: value,
            unitPrice: selected ? String(selected.discountPrice) : item.unitPrice,
          };
        }
        return { ...item, [field]: value };
      })
    );
    clearItemError(index, field);
  };

  const getItemName = (order: Order, productId: string) => {
    const selected = productMap.get(productId);
    if (selected) return selected.name;
    return order.items.find((item) => item.productId === productId)?.name || "Unknown product";
  };

  const getItemUnit = (order: Order, productId: string) => {
    const selected = productMap.get(productId);
    if (selected) return selected.per;
    return order.items.find((item) => item.productId === productId)?.per || "";
  };

  const getContactInfo = async () => {
    if (contactInfo) return contactInfo;
    const content = await apiGet<ContentResponse>("/api/content");
    setContactInfo(content.contact);
    return content.contact;
  };

  const downloadInvoice = async (order: Order) => {
    try {
      setDownloadingOrderId(order.id);
      const contact = await getContactInfo();
      generateInvoicePdf(order, contact);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Could not generate invoice");
    } finally {
      setDownloadingOrderId(null);
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
          <div className="flex flex-col gap-3 mb-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs text-gray-500">{order.id}</p>
              <p className="font-semibold text-gray-800">
                {order.customer.name} · {order.customer.phone}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
              <button
                onClick={() => downloadInvoice(order)}
                disabled={downloadingOrderId === order.id}
                className="text-xs border border-gray-300 rounded-md px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {downloadingOrderId === order.id ? "Generating..." : "Invoice PDF"}
              </button>
              {editingOrderId === order.id ? (
                <>
                  <button
                    onClick={() => saveEdit(order.id)}
                    disabled={savingOrderId === order.id}
                    className="text-xs bg-orange-500 text-white rounded-md px-2 py-1 hover:bg-orange-600 disabled:opacity-60"
                  >
                    {savingOrderId === order.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-xs border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(order)}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {editingOrderId === order.id ? (
            <div className="mb-3 space-y-3">
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <input
                    value={editCustomer.name}
                    onChange={(e) => {
                      setEditCustomer((prev) => ({ ...prev, name: e.target.value }));
                      setFieldErrors((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, name: undefined },
                      }));
                    }}
                    placeholder="Customer name"
                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-1"
                  />
                  {fieldErrors.customer.name && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.customer.name}</p>
                  )}
                </div>

                <div>
                  <input
                    value={editCustomer.phone}
                    onChange={(e) => {
                      setEditCustomer((prev) => ({ ...prev, phone: e.target.value }));
                      setFieldErrors((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, phone: undefined },
                      }));
                    }}
                    placeholder="Phone"
                    className="w-full text-xs border border-gray-300 rounded-md px-2 py-1"
                  />
                  {fieldErrors.customer.phone && (
                    <p className="mt-1 text-[11px] text-red-600">{fieldErrors.customer.phone}</p>
                  )}
                </div>

                <input
                  value={editCustomer.address}
                  onChange={(e) =>
                    setEditCustomer((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Address"
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 md:col-span-3"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700">Line items</p>
                <button
                  onClick={addItem}
                  type="button"
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                >
                  Add item
                </button>
              </div>

              <div className="space-y-2">
                {editItems.map((draft, index) => {
                  const qty = Number(draft.qty || 0);
                  const unitPrice = Number(draft.unitPrice || 0);
                  const total = Number.isFinite(qty * unitPrice) ? qty * unitPrice : 0;

                  const hasUnknownProduct =
                    Boolean(draft.productId) && !productMap.has(draft.productId);

                  return (
                    <div
                      key={`${draft.productId || "new"}-${index}`}
                      className="rounded-md border border-gray-200 p-2 md:p-3"
                    >
                      <div className="grid gap-2 md:grid-cols-12 md:items-start">
                        <div className="md:col-span-5">
                          <label className="text-[11px] text-gray-500">Product</label>
                          <select
                            value={draft.productId}
                            onChange={(e) => updateItemField(index, "productId", e.target.value)}
                            className="mt-1 w-full text-xs border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="">Select product...</option>
                            {hasUnknownProduct && (
                              <option value={draft.productId}>Unknown product (existing)</option>
                            )}
                            {activeProducts.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.items[index]?.productId && (
                            <p className="mt-1 text-[11px] text-red-600">
                              {fieldErrors.items[index].productId}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[11px] text-gray-500">Qty</label>
                          <input
                            value={draft.qty}
                            onChange={(e) => updateItemField(index, "qty", e.target.value)}
                            className="mt-1 w-full text-xs border border-gray-300 rounded-md px-2 py-1"
                            inputMode="numeric"
                          />
                          {fieldErrors.items[index]?.qty && (
                            <p className="mt-1 text-[11px] text-red-600">{fieldErrors.items[index].qty}</p>
                          )}
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[11px] text-gray-500">Unit price (Rs.)</label>
                          <input
                            value={draft.unitPrice}
                            onChange={(e) => updateItemField(index, "unitPrice", e.target.value)}
                            className="mt-1 w-full text-xs border border-gray-300 rounded-md px-2 py-1"
                            inputMode="decimal"
                          />
                          {fieldErrors.items[index]?.unitPrice && (
                            <p className="mt-1 text-[11px] text-red-600">
                              {fieldErrors.items[index].unitPrice}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1">
                          <label className="text-[11px] text-gray-500">Line total</label>
                          <p className="text-xs font-semibold text-gray-800 pt-1">Rs.{total.toFixed(2)}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="mt-1 text-xs border border-red-200 text-red-600 rounded-md px-2 py-1 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-gray-500">
                        {getItemName(order, draft.productId)}
                        {getItemUnit(order, draft.productId)
                          ? ` · ${getItemUnit(order, draft.productId)}`
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>

              {submitError && <p className="text-xs text-red-600">{submitError}</p>}
            </div>
          ) : (
            order.customer.address && (
              <p className="text-xs text-gray-500 mb-2">{order.customer.address}</p>
            )
          )}

          {editingOrderId !== order.id && (
            <div className="text-sm text-gray-600 space-y-0.5 mb-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    {item.name} × {item.qty}
                  </span>
                  <span className="shrink-0">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between text-sm font-semibold text-gray-800 border-t border-gray-100 pt-2">
            {editingOrderId === order.id ? (
              (() => {
                const qty = editItems.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
                const amount = editItems.reduce(
                  (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
                  0
                );

                return (
                  <>
                    <span>{qty} items</span>
                    <span>₹{amount.toFixed(2)}</span>
                  </>
                );
              })()
            ) : (
              <>
                <span>{order.totalQty} items</span>
                <span>₹{order.totalAmount}</span>
              </>
            )}
          </div>

          {order.editHistory && order.editHistory.length > 0 && (
            <details className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
              <summary className="cursor-pointer text-xs font-medium text-gray-700">
                Audit trail ({order.editHistory.length})
              </summary>
              <div className="mt-2 space-y-2">
                {order.editHistory.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-gray-200 bg-white p-2">
                    <p className="text-xs font-semibold text-gray-800">{entry.note}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {entry.changedBy.name}
                      {entry.changedBy.email ? ` (${entry.changedBy.email})` : ""}
                      {" · "}
                      {new Date(entry.changedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}

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
