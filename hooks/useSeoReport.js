import { useState } from "react";
import { fetchSeoReport } from "../services/seoService";

export function useSeoReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (url) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSeoReport(url);
      setReport(data);
    } catch (err) {
      setError(err.message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return { report, loading, error, analyze };
}
