import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { adminForm, adminJson, apiGet, assetUrl } from "../../api/client";
import type { Banner, TrustedPartner } from "../../types";

const emptyBanner = { title: "", subtitle: "", desc: "" };

export default function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [partners, setPartners] = useState<TrustedPartner[]>([]);
  const [form, setForm] = useState(emptyBanner);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [partnerAlt, setPartnerAlt] = useState("");
  const [partnerFile, setPartnerFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiGet<{
      banners: Banner[];
      trustedPartners: TrustedPartner[];
    }>("/api/content").then((c) => {
      setBanners(c.banners);
      setPartners(c.trustedPartners);
    });
  };

  useEffect(load, []);

  const addBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!imageFile) {
      setError("Please choose a banner image.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("desc", form.desc);
      fd.append("image", imageFile);
      await adminForm("/api/content/banners", "POST", fd);
      setForm(emptyBanner);
      setImageFile(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add banner");
    } finally {
      setSaving(false);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await adminJson(`/api/content/banners/${id}`, "DELETE");
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const addPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!partnerFile) {
      setError("Please choose a logo image.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("alt", partnerAlt || "Trusted partner");
      fd.append("image", partnerFile);
      await adminForm("/api/content/partners", "POST", fd);
      setPartnerAlt("");
      setPartnerFile(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add partner logo");
    } finally {
      setSaving(false);
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Delete this partner logo?")) return;
    await adminJson(`/api/content/partners/${id}`, "DELETE");
    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-10">
      <section>
        <h3 className="font-semibold text-gray-800 mb-3">Homepage banners (ad images)</h3>
        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          <form
            onSubmit={addBanner}
            className="bg-white rounded-lg border border-gray-200 p-4 h-max space-y-3"
          >
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
            <input
              placeholder="Subtitle"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
            <input
              placeholder="Description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-xs"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
            >
              Add banner
            </button>
          </form>

          <div className="grid sm:grid-cols-2 gap-3">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden relative"
              >
                <img src={assetUrl(b.image)} alt={b.title} className="w-full h-32 object-cover" />
                <button
                  onClick={() => deleteBanner(b.id)}
                  aria-label={`Delete banner ${b.title}`}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-gray-500 hover:text-red-500"
                >
                  <X size={14} />
                </button>
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-800 truncate">{b.title}</p>
                  <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-gray-800 mb-3">Trusted partner logos</h3>
        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          <form
            onSubmit={addPartner}
            className="bg-white rounded-lg border border-gray-200 p-4 h-max space-y-3"
          >
            <input
              placeholder="Alt text (e.g. brand name)"
              value={partnerAlt}
              onChange={(e) => setPartnerAlt(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPartnerFile(e.target.files?.[0] ?? null)}
              className="w-full text-xs"
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
            >
              Add logo
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg border border-gray-200 p-3 relative w-40"
              >
                <img src={assetUrl(p.image)} alt={p.alt} className="w-full h-16 object-contain" />
                <button
                  onClick={() => deletePartner(p.id)}
                  aria-label={`Delete partner logo ${p.alt}`}
                  className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
