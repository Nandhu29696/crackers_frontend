import { Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react";
import { adminJson, assetUrl } from "../../../api/client";
import type { Category } from "../../../types";

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function CategoryCard({
  category,
  onEdit,
  onRefresh,
}: CategoryCardProps) {
  const toggle = async (): Promise<void> => {
    await adminJson(`/api/categories/${category.id}/status`, "PATCH", {
      status: !category.status,
    });

    onRefresh();
  };

  const remove = async (): Promise<void> => {
    if (!window.confirm("Delete category?")) return;

    await adminJson(`/api/categories/${category.id}`, "DELETE");
    onRefresh();
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white p-3 transition hover:shadow-sm">
      <img
        src={assetUrl(category.image)}
        alt={category.name}
        className="h-14 w-14 rounded-md object-cover"
      />

      <div className="flex-1">
        <p className="font-medium">{category.name}</p>
        <p className="text-xs text-gray-500">{category.nameTa}</p>
        <p className="text-xs text-gray-400">
          Order: {category.displayOrder}
        </p>
      </div>

      <span
        className={`rounded-full px-2 py-1 text-xs ${
          category.status
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {category.status ? "Active" : "Hidden"}
      </span>

      <button
        type="button"
        onClick={toggle}
        className="p-1 hover:text-blue-600"
      >
        {category.status ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="p-1 hover:text-blue-600"
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        onClick={remove}
        className="p-1 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}