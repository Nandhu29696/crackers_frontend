import { useState } from "react";
import { X } from "lucide-react";
import { adminForm, assetUrl } from "../../../api/client";
import type { Category } from "../../../types";

/* ---------- TYPES ---------- */

interface CategoryFormProps {
  selected: Category | null;
  onSuccess: () => void;
}

interface CategoryFormState {
  name: string;
  nameTa: string;
  displayOrder: string;
}

/* ---------- OUTER COMPONENT (handles remount) ---------- */

export default function CategoryForm(props: CategoryFormProps) {
  return (
    <FormInner
      key={props.selected?.id || "new"} // 🔥 forces reset when editing changes
      {...props}
    />
  );
}

/* ---------- INNER COMPONENT ---------- */

function FormInner({ selected, onSuccess }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormState>({
    name: selected?.name || "",
    nameTa: selected?.nameTa || "",
    displayOrder: String(selected?.displayOrder ?? 0),
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    selected?.image ? assetUrl(selected.image) : null
  );

  const [saving, setSaving] = useState(false);

  /* ---------- RESET ---------- */
  const resetForm = () => {
    setForm({ name: "", nameTa: "", displayOrder: "0" });
    setImage(null);
    setPreview(null);
  };

  /* ---------- IMAGE ---------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("nameTa", form.nameTa.trim());
      fd.append("displayOrder", String(Number(form.displayOrder)));

      if (image) {
        fd.append("image", image);
      }

      if (selected) {
        await adminForm(`/api/categories/${selected.id}`, "PUT", fd);
      } else {
        await adminForm("/api/categories", "POST", fd);
      }

      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Category save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-lg border space-y-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">
          {selected ? "Edit Category" : "Add Category"}
        </h3>

        {selected && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onSuccess();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Name */}
      <input
        placeholder="Category name"
        value={form.name}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, name: e.target.value }))
        }
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        required
      />

      {/* Tamil Name */}
      <input
        placeholder="Tamil name (optional)"
        value={form.nameTa}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, nameTa: e.target.value }))
        }
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
      />

      {/* Display Order */}
      <input
        type="number"
        min="0"
        value={form.displayOrder}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            displayOrder: e.target.value,
          }))
        }
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
      />

      {/* Image Upload */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-28 w-full object-cover rounded-md border"
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
      >
        {saving
          ? "Saving..."
          : selected
          ? "Update Category"
          : "Create Category"}
      </button>
    </form>
  );
}