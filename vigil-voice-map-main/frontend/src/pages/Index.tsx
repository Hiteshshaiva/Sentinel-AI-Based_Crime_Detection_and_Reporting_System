import { Link } from "react-router-dom";
import { MessageSquare, FileText, Map, Shield, ArrowRight, AlertTriangle } from "lucide-react";
import { useCrimeReports } from "@/hooks/use-crime-reports";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chatbot Reporting",
    desc: "Report crimes through conversational AI that automatically classifies incident types.",
    to: "/chatbot",
  },
  {
    icon: FileText,
    title: "Structured Report Form",
    desc: "Submit detailed crime reports with location data and incident descriptions.",
    to: "/report",
  },
  {
    icon: Map,
    title: "Live Crime Map",
    desc: "Real-time geographic visualization of reported incidents across the city.",
    to: "/map",
  },
  {
    icon: Shield,
    title: "Admin Dashboard",
    desc: "Monitor reports, view analytics, and manage incident data in real-time.",
    to: "/admin",
  },
];

export default function Index() {
  const reports = useCrimeReports();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle className="h-5 w-5 text-crime-assault" />
          <h1 className="text-display">Sentinel</h1>
        </div>
        <p className="text-body text-muted-foreground max-w-xl">
          AI-driven public safety portal. Report incidents, monitor crime data, and access real-time geographic intelligence.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Reports", value: reports.length },
          { label: "Theft", value: reports.filter((r) => r.crime_type === "theft").length },
          { label: "Assault", value: reports.filter((r) => r.crime_type === "assault").length },
          { label: "Fraud", value: reports.filter((r) => r.crime_type === "fraud").length },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card shadow-card rounded-lg p-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-semibold font-mono-data mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
          >
            <Link
              to={f.to}
              className="block bg-card shadow-card rounded-lg p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="h-9 w-9 rounded-sm bg-primary flex items-center justify-center">
                  <f.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="font-semibold mt-3 text-sm">{f.title}</h2>
              <p className="text-body text-muted-foreground mt-1">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
