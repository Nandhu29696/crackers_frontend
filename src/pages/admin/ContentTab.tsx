import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { adminForm, adminJson, apiGet } from "../../api/client";
import type {
  HomeContent,
  SpecificationItem,
  WayWeWorkStep,
  WhyChooseUsItem,
} from "../../types";

const ICON_OPTIONS = [
  "check-circle",
  "package",
  "truck",
  "rupee",
  "sparkles",
  "award",
  "star",
  "tag",
  "wand",
  "rocket",
];

let uid = 0;
const nextId = (prefix: string) => `${prefix}${Date.now()}-${uid++}`;

export default function ContentTab() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [wayWeWorkImageFile, setWayWeWorkImageFile] = useState<File | null>(null);

  useEffect(() => {
    apiGet<HomeContent>("/api/content").then(setContent);
  }, []);

  if (!content) return <p className="text-gray-500 text-sm">Loading...</p>;

  const update = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) =>
    setContent({ ...content, [key]: value });

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      let wayWeWorkImage = content.wayWeWorkImage;
      if (wayWeWorkImageFile) {
        const fd = new FormData();
        fd.append("image", wayWeWorkImageFile);
        const res = await adminForm<{ url: string }>(
          "/api/content/misc-image",
          "POST",
          fd
        );
        wayWeWorkImage = res.url;
      }

      const { banners: _b, trustedPartners: _t, ...rest } = content;
      void _b;
      void _t;
      const updated = await adminJson<HomeContent>("/api/content", "PUT", {
        ...rest,
        wayWeWorkImage,
      });
      setContent((prev) => (prev ? { ...prev, ...updated } : prev));
      setWayWeWorkImageFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Contact */}
      <section>
        <h3 className="font-semibold text-gray-800 mb-3">Contact details</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {(["phone", "whatsapp", "email", "address"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-gray-600 capitalize">
                {field}
              </label>
              <input
                value={content.contact[field]}
                onChange={(e) =>
                  update("contact", { ...content.contact, [field]: e.target.value })
                }
                className="w-full mt-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Why Choose Us</h3>
          <button
            onClick={() =>
              update("whyChooseUs", [
                ...content.whyChooseUs,
                { id: nextId("w"), icon: "sparkles", title: "" },
              ])
            }
            className="text-sm text-orange-600 flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Add item
          </button>
        </div>
        <div className="space-y-2">
          {content.whyChooseUs.map((item, i) => (
            <WhyChooseUsRow
              key={item.id}
              item={item}
              onChange={(next) => {
                const list = [...content.whyChooseUs];
                list[i] = next;
                update("whyChooseUs", list);
              }}
              onDelete={() =>
                update(
                  "whyChooseUs",
                  content.whyChooseUs.filter((x) => x.id !== item.id)
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Our Specification</h3>
          <button
            onClick={() =>
              update("specifications", [
                ...content.specifications,
                { id: nextId("s"), icon: "sparkles", title: "", desc: "" },
              ])
            }
            className="text-sm text-orange-600 flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Add item
          </button>
        </div>
        <div className="space-y-3">
          {content.specifications.map((item, i) => (
            <SpecificationRow
              key={item.id}
              item={item}
              onChange={(next) => {
                const list = [...content.specifications];
                list[i] = next;
                update("specifications", list);
              }}
              onDelete={() =>
                update(
                  "specifications",
                  content.specifications.filter((x) => x.id !== item.id)
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Way We Work */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">The Way We Work</h3>
          <button
            onClick={() =>
              update("wayWeWork", [
                ...content.wayWeWork,
                { id: nextId("step"), title: "", desc: "" },
              ])
            }
            className="text-sm text-orange-600 flex items-center gap-1 hover:underline"
          >
            <Plus size={14} /> Add step
          </button>
        </div>
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600">
            Illustration image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setWayWeWorkImageFile(e.target.files?.[0] ?? null)}
            className="w-full mt-1 text-xs"
          />
        </div>
        <div className="space-y-3">
          {content.wayWeWork.map((step, i) => (
            <WayWeWorkRow
              key={step.id}
              step={step}
              onChange={(next) => {
                const list = [...content.wayWeWork];
                list[i] = next;
                update("wayWeWork", list);
              }}
              onDelete={() =>
                update(
                  "wayWeWork",
                  content.wayWeWork.filter((x) => x.id !== step.id)
                )
              }
            />
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition flex items-center gap-2"
      >
        <Save size={16} /> {saving ? "Saving..." : "Save changes"}
      </button>
      {saved && <span className="ml-3 text-sm text-green-600">Saved!</span>}
    </div>
  );
}

function WhyChooseUsRow({
  item,
  onChange,
  onDelete,
}: {
  item: WhyChooseUsItem;
  onChange: (item: WhyChooseUsItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-2">
      <select
        value={item.icon}
        onChange={(e) => onChange({ ...item, icon: e.target.value })}
        className="border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      >
        {ICON_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <input
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        placeholder="Title"
        className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
      />
      <button onClick={onDelete} aria-label="Remove item" className="text-gray-400 hover:text-red-500">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function SpecificationRow({
  item,
  onChange,
  onDelete,
}: {
  item: SpecificationItem;
  onChange: (item: SpecificationItem) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 space-y-2">
      <div className="flex items-center gap-2">
        <select
          value={item.icon}
          onChange={(e) => onChange({ ...item, icon: e.target.value })}
          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm"
        >
          {ICON_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          placeholder="Title"
          className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
        />
        <button onClick={onDelete} aria-label="Remove item" className="text-gray-400 hover:text-red-500">
          <Trash2 size={15} />
        </button>
      </div>
      <textarea
        value={item.desc}
        onChange={(e) => onChange({ ...item, desc: e.target.value })}
        placeholder="Description"
        rows={2}
        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
      />
    </div>
  );
}

function WayWeWorkRow({
  step,
  onChange,
  onDelete,
}: {
  step: WayWeWorkStep;
  onChange: (step: WayWeWorkStep) => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={step.title}
          onChange={(e) => onChange({ ...step, title: e.target.value })}
          placeholder="Step title"
          className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
        />
        <button onClick={onDelete} aria-label="Remove step" className="text-gray-400 hover:text-red-500">
          <Trash2 size={15} />
        </button>
      </div>
      <textarea
        value={step.desc}
        onChange={(e) => onChange({ ...step, desc: e.target.value })}
        placeholder="Description"
        rows={2}
        className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
      />
    </div>
  );
}
