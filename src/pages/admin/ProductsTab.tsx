import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { adminForm, adminJson, apiGet, assetUrl } from "../../api/client";
import type { Category, Product } from "../../types";

const emptyForm = {
  id: "",
  name: "",
  nameTa: "",
  categoryId: "",
  price: "",
  per: "1 BOX",
  discountPrice: "",
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCat, setFilterCat] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    Promise.all([
      apiGet<Category[]>("/api/categories"),
      apiGet<Product[]>("/api/products"),
    ]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
    });
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditing(false);
  };

  const startEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      nameTa: p.nameTa,
      categoryId: p.categoryId,
      price: String(p.price),
      per: p.per,
      discountPrice: String(p.discountPrice),
    });
    setImageFile(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.categoryId || !form.price || !form.discountPrice) {
      setError("Name, category, price and discount price are required.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("nameTa", form.nameTa);
      fd.append("categoryId", form.categoryId);
      fd.append("price", form.price);
      fd.append("per", form.per);
      fd.append("discountPrice", form.discountPrice);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminForm(`/api/products/${form.id}`, "PUT", fd);
      } else {
        await adminForm("/api/products", "POST", fd);
      }
      resetForm();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await adminJson(`/api/products/${id}`, "DELETE");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete product");
    }
  };

  const visible = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        filterCat === "" || String(p.categoryId) === String(filterCat);

      const matchSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, filterCat, search]);

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-4 h-max"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            {editing ? "Edit product" : "Add product"}
          </h3>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Cancel edit"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Tamil name (optional)
            </label>
            <input
              value={form.nameTa}
              onChange={(e) => setForm({ ...form, nameTa: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600">MRP (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">
                Discount price (₹)
              </label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Unit</label>
            <input
              value={form.per}
              onChange={(e) => setForm({ ...form, per: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
              placeholder="1 BOX"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Product image (optional — falls back to category art)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full mt-1 text-xs"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            {saving ? "Saving..." : editing ? "Update product" : "Add product"}
          </button>
        </div>
      </form>

      {/* List */}
      <div>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
          >
            <option value="">All Categories ({products.length})</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {visible.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3"
            >
              <img
                src={assetUrl(p.image)}
                alt={p.name}
                className="w-12 h-12 rounded-md object-cover bg-gray-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{p.discountPrice} / {p.per}
                </p>
              </div>
              <button
                onClick={() => startEdit(p)}
                aria-label={`Edit ${p.name}`}
                className="text-gray-400 hover:text-orange-500"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                aria-label={`Delete ${p.name}`}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
