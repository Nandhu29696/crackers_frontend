import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiGet } from "../../api/client";
import type { Category } from "../../types";
import CategoryForm from "./CategoryForm/CategoryForm";
import CategoryCard from "./CategoryForm/CategoryCard";

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await apiGet<Category[]>("/api/categories");
    setCategories(data);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await apiGet<Category[]>("/api/categories");

        if (mounted) {
          setCategories(data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(q) ||
        (category.nameTa ?? "").toLowerCase().includes(q)
    );
  }, [categories, search]);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <CategoryForm
        selected={selected}
        onSuccess={async () => {
          setSelected(null);
          await load();
        }}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories</h2>

          <div className="relative w-64">
            <Search
              size={16}
              className="absolute left-2 top-2.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border py-2 pl-8 pr-3 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400">No categories found.</p>
        ) : (
          <div className="grid gap-3">
            {filtered.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={() => setSelected(category)}
                onRefresh={load}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}