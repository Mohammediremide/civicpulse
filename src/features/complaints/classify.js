// Demo rule-based "who should handle this?" classifier.
//
// This is intentionally simple keyword matching — NOT real AI — so the
// UI never overstates what's happening. It is isolated in its own
// module so a real classification service (NLP/AI) can replace the
// implementation later without any caller needing to change.
const RULES = [
  { test: /internet|network|data|sim|airtime|telecom/, type: "Consumer", category: "Telecommunications", authority: "Telecommunications complaint workflow" },
  { test: /bank|charge|deduct|transfer|atm|account/, type: "Consumer", category: "Banking & Finance", authority: "Financial services complaint workflow" },
  { test: /refund|order|deliver|product|vendor|online/, type: "Consumer", category: "Retail & E-commerce", authority: "Consumer protection workflow" },
  { test: /pothole|road|bridge|manhole/, type: "Community", category: "Road Infrastructure", authority: "Public Works" },
  { test: /flood|drain|gutter/, type: "Community", category: "Flooding & Drainage", authority: "Environmental / Drainage Services" },
  { test: /light|electric|transformer|streetlight/, type: "Community", category: "Street Lighting", authority: "Public Works" },
  { test: /waste|refuse|dump|trash|garbage/, type: "Community", category: "Waste Management", authority: "Waste Management" },
  { test: /water|pipe|borehole/, type: "Community", category: "Water Infrastructure", authority: "Water Services" },
  { test: /hospital|clinic|nurse|doctor/, type: "Government", category: "Public Hospital", authority: "Health Services" },
  { test: /school|teacher|classroom|certificate/, type: "Government", category: "Public School / Local Govt.", authority: "Local Government" },
];

export function classify(text) {
  const t = (text || "").toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(t)) return { type: rule.type, category: rule.category, authority: rule.authority };
  }
  return { type: "Community", category: "General Community Issue", authority: "Public Works (default routing)" };
}
