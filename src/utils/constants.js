// Shared design tokens and lookup tables used across the app.
// Keeping these in one place means status/priority colors stay
// consistent whether they're rendered in a badge, a chart, or the map.

export const STATUS_STYLES = {
  Submitted:     { bg: "#EFF3FF", fg: "#1F4FD8", dot: "#1F4FD8" },
  Received:      { bg: "#EFF3FF", fg: "#1F4FD8", dot: "#1F4FD8" },
  "Under Review":{ bg: "#FEF3E2", fg: "#B45309", dot: "#D97706" },
  Verified:      { bg: "#EAF6F4", fg: "#0E9C8C", dot: "#0E9C8C" },
  Assigned:      { bg: "#EAF6F4", fg: "#0E9C8C", dot: "#0E9C8C" },
  Investigation: { bg: "#FFF1E9", fg: "#C2410C", dot: "#EA580C" },
  "In Progress": { bg: "#FFF1E9", fg: "#C2410C", dot: "#EA580C" },
  Resolved:      { bg: "#EAFAEF", fg: "#15803D", dot: "#16A34A" },
  Closed:        { bg: "#F1F5F9", fg: "#475569", dot: "#94A3B8" },
};

export const PRIORITY_STYLES = {
  Critical: { bg: "#FDECEC", fg: "#DC2626" },
  High:     { bg: "#FFF1E9", fg: "#EA580C" },
  Medium:   { bg: "#FEF9E7", fg: "#D97706" },
  Normal:   { bg: "#EFF3FF", fg: "#1F4FD8" },
};

export const STATUS_SEQUENCE = [
  "Submitted", "Received", "Under Review", "Verified", "Assigned", "In Progress", "Resolved",
];

export const PIE_COLORS = ["#1F4FD8", "#0E9C8C", "#EA580C", "#7C3AED", "#D97706", "#16A34A", "#DC2626", "#0A1B2E"];
