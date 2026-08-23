// Data-access layer for complaints/reports.
//
// Today this just wraps the in-memory demo dataset. When a real backend
// exists, swap the bodies of these functions for `fetch` calls against
// VITE_API_BASE_URL — the rest of the app talks to this module only,
// never to the seed data directly, so that swap is contained here.
import { seedReports } from "../data/seedReports.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function getInitialReports() {
  return seedReports();
}

export async function fetchReports() {
  if (!API_BASE_URL) {
    // No backend configured yet — fall back to demo data.
    return seedReports();
  }
  const res = await fetch(`${API_BASE_URL}/reports`);
  if (!res.ok) throw new Error("Failed to load reports");
  return res.json();
}

export function generateReferenceNumber() {
  const random = String(Math.floor(Math.random() * 9000) + 1000).padStart(6, "0");
  const year = new Date().getFullYear();
  return `CIV-${year}-${random}`;
}

export async function submitReport(report) {
  if (!API_BASE_URL) {
    // Demo mode: nothing to persist server-side, just hand the record back.
    return { ...report, id: report.id || generateReferenceNumber() };
  }
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  if (!res.ok) throw new Error("Failed to submit report");
  return res.json();
}
