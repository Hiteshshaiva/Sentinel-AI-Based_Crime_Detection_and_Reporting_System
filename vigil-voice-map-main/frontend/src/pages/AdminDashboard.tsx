import { useCrimeReports } from "@/hooks/use-crime-reports";
import { getCrimeColor, deleteReport, type CrimeType } from "@/lib/crime-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const CRIME_TYPES: CrimeType[] = ["theft", "assault", "fraud", "vandalism", "other"];

export default function AdminDashboard() {
  const reports = useCrimeReports();

  const chartData = CRIME_TYPES.map((type) => ({
    name: type,
    count: reports.filter((r) => r.crime_type === type).length,
    color: getCrimeColor(type),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-display">Admin Dashboard</h1>
        <p className="text-body text-muted-foreground">Real-time incident monitoring and analytics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {CRIME_TYPES.map((type) => {
          const count = reports.filter((r) => r.crime_type === type).length;
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card shadow-card rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getCrimeColor(type) }} />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{type}</span>
              </div>
              <p className="text-xl font-semibold font-mono-data">{count}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-card shadow-card rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-4">Incidents by Type</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-card shadow-card rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">All Reports</h2>
          <span className="text-[10px] font-mono-data text-muted-foreground">{reports.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Coordinates</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getCrimeColor(r.crime_type) }} />
                      <span className="uppercase text-xs font-medium">{r.crime_type}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-body">{r.location}</td>
                  <td className="px-5 py-3 text-body max-w-xs truncate">{r.description}</td>
                  <td className="px-5 py-3 font-mono-data text-xs text-muted-foreground">
                    {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                  </td>
                  <td className="px-5 py-3 font-mono-data text-xs text-muted-foreground">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={async () => {
  await deleteReport(r.id);
  window.location.reload();
}}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded hover:bg-destructive/10"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
