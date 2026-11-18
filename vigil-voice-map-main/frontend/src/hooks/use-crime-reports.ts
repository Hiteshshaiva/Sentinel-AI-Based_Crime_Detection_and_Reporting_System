import { useState, useEffect } from "react";
import { getReports, CrimeReport } from "@/lib/crime-store";

export function useCrimeReports() {
  const [reports, setReports] = useState<CrimeReport[]>([]);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReports();

    const interval = setInterval(loadReports, 5000);

    return () => clearInterval(interval);
  }, []);

  return reports;
}