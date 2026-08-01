import { useState } from "react";
import { addReport, type CrimeType } from "@/lib/crime-store";
import { toast } from "sonner";
import { motion } from "framer-motion";

const crimeTypes: { value: CrimeType; label: string }[] = [
  { value: "theft", label: "Theft" },
  { value: "assault", label: "Assault" },
  { value: "fraud", label: "Fraud" },
  { value: "vandalism", label: "Vandalism" },
  { value: "other", label: "Other" },
];

export default function ReportForm() {
  const [form, setForm] = useState({
    crime_type: "theft" as CrimeType,
    location: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.description) {
      toast.error("Location and description are required.");
      return;
    }
    await addReport({
      crime_type: form.crime_type,
      location: form.location,
      description: form.description,
      latitude: parseFloat(form.latitude) || 40.7128 + (Math.random() - 0.5) * 0.02,
      longitude: parseFloat(form.longitude) || -74.006 + (Math.random() - 0.5) * 0.02,
    });
    toast.success("Report filed successfully.");
    window.location.href = "/map";
    setForm({ crime_type: "theft", location: "", description: "", latitude: "", longitude: "" });
  };

  const inputClass = "w-full bg-input rounded-sm px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="p-6 max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-display mb-1">File Report</h1>
        <p className="text-body text-muted-foreground mb-6">Submit a structured incident report with location data.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Crime Type
            </label>
            <select
              value={form.crime_type}
              onChange={(e) => setForm((f) => ({ ...f, crime_type: e.target.value as CrimeType }))}
              className={inputClass}
            >
              {crimeTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g., Downtown Plaza"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the incident in detail..."
              rows={4}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Latitude
              </label>
              <input
                value={form.latitude}
                onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                placeholder="40.7128"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Longitude
              </label>
              <input
                value={form.longitude}
                onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                placeholder="-74.0060"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground rounded-sm py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            File Official Report
          </button>
        </form>
      </motion.div>
    </div>
  );
}
