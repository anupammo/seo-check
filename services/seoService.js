// Example: SEO API service
export async function fetchSeoReport(url) {
  const res = await fetch("/api/seo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch SEO report");
  return res.json();
}
