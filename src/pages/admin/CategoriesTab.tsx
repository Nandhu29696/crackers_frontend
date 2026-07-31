import { useEffect, useState } from "react";
import { Pencil, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { adminForm, adminJson, apiGet, assetUrl } from "../../api/client";
import type { Category } from "../../types";

const emptyForm = { id: "", name: "", nameTa: "", displayOrder: "0" };

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiGet<Category[]>("/api/categories").then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditing(false);
    setError("");
  };

  const startEdit = (c: Category) => {
    setForm({
      id: c.id,
      name: c.name,
      nameTa: c.nameTa || "",
      displayOrder: String(c.displayOrder ?? 0),
    });
    setImageFile(null);
    setEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("nameTa", form.nameTa);
      fd.append("displayOrder", form.displayOrder);
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminForm(`/api/categories/${form.id}`, "PUT", fd);
      } else {
        await adminForm("/api/categories", "POST", fd);
      }
      resetForm();
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will also be affected.")) return;
    try {
      await adminJson(`/api/categories/${id}`, "DELETE");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete category");
    }
  };

  const toggleStatus = async (c: Category) => {
    try {
      await adminJson(`/api/categories/${c.id}/status`, "PATCH", { status: !c.status });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status");
    }
  };

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-4 h-max"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            {editing ? "Edit category" : "Add category"}
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
              placeholder="e.g. Sparklers"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Tamil name (optional)</label>
            <input
              value={form.nameTa}
              onChange={(e) => setForm({ ...form, nameTa: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Display order</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Category image</label>
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
            {saving ? "Saving…" : editing ? "Update category" : "Add category"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-2">
        {categories.length === 0 && (
          <p className="text-gray-500 text-sm">No categories yet.</p>
        )}
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3"
          >
            <img
              src={assetUrl(c.image)}
              alt={c.name}
              className="w-12 h-12 object-cover rounded-md bg-gray-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">{c.name}</p>
              {c.nameTa && <p className="text-xs text-gray-500">{c.nameTa}</p>}
              <p className="text-xs text-gray-400">Order: {c.displayOrder}</p>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                c.status ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {c.status ? "Active" : "Hidden"}
            </span>
            <button
              onClick={() => toggleStatus(c)}
              aria-label="Toggle status"
              className="text-gray-400 hover:text-orange-500"
            >
              {c.status ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </button>
            <button
              onClick={() => startEdit(c)}
              aria-label={`Edit ${c.name}`}
              className="text-gray-400 hover:text-orange-500"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(c.id)}
              aria-label={`Delete ${c.name}`}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
