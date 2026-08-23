// Fictional/demo report records only. No real citizen data.
// This is the single source of truth for demo complaints — swap this
// module for a real API call (see src/services/reportsService.js)
// once a backend is connected.
const RAW = [
  ["CIV-2026-004821", "Broken streetlight on Allen Avenue", "Community", "Street Lighting", "Ikeja, Lagos", 52, 34, "High", "In Progress", "Public Works", "2026-08-12", "Streetlight has been off for two weeks, making the junction unsafe at night."],
  ["CIV-2026-004791", "Flooding after every heavy rainfall", "Community", "Flooding & Drainage", "Surulere, Lagos", 38, 52, "Critical", "Investigation", "Environmental Services", "2026-08-14", "Blocked drainage channel causes flooding on Adeniran Ogunsanya Street."],
  ["CIV-2026-004763", "Deep pothole damaging vehicles", "Community", "Road Infrastructure", "Yaba, Lagos", 47, 46, "High", "Assigned", "Public Works", "2026-08-10", "A large pothole near Herbert Macaulay Way has damaged three cars this month."],
  ["CIV-2026-004617", "Blocked drainage causing waterlogging", "Community", "Flooding & Drainage", "Agege, Lagos", 55, 18, "Medium", "Resolved", "Environmental Services", "2026-07-29", "Drain was cleared and flow restored."],
  ["CIV-2026-004690", "Uncollected refuse for 10 days", "Community", "Waste Management", "Apapa, Lagos", 30, 60, "Medium", "Under Review", "Waste Management", "2026-08-09", "Waste has not been collected along Marine Beach Road."],
  ["CIV-2026-004512", "Persistent low water pressure", "Community", "Water Infrastructure", "Lekki, Lagos", 78, 66, "Normal", "Under Review", "Water Services", "2026-08-08", "Water pressure has been low for the past three weeks."],
  ["CIV-2026-004544", "Internet activation never completed", "Consumer", "Telecommunications", "Victoria Island, Lagos", 64, 60, "High", "In Progress", "—", "2026-08-11", "Provider charged for installation but service was never activated."],
  ["CIV-2026-004498", "Unauthorized deduction on savings account", "Consumer", "Banking & Finance", "Ikeja, Lagos", 52, 34, "High", "Verified", "—", "2026-08-07", "A recurring charge appeared without any prior notice from the bank."],
  ["CIV-2026-004455", "Wrong item delivered, refund refused", "Consumer", "Retail & E-commerce", "Yaba, Lagos", 47, 46, "Medium", "Received", "—", "2026-08-06", "Vendor delivered the wrong item and has declined to issue a refund."],
  ["CIV-2026-004389", "Long queues, no staff at counter", "Government", "Public Hospital", "Surulere, Lagos", 38, 52, "Medium", "Assigned", "Health Services", "2026-08-05", "General outpatient department has been understaffed for two weeks."],
  ["CIV-2026-004321", "Delayed birth certificate processing", "Government", "Public School", "Agege, Lagos", 55, 18, "Normal", "Under Review", "Local Government", "2026-08-03", "Application submitted six weeks ago with no update."],
  ["CIV-2026-004290", "Classroom roof leaking during rains", "Government", "Public School", "Ajah, Lagos", 88, 72, "High", "In Progress", "Local Government", "2026-08-02", "Pupils have to be relocated whenever it rains."],
  ["CIV-2026-004102", "Streetlight outage across three blocks", "Community", "Street Lighting", "Lekki, Lagos", 78, 66, "Medium", "Resolved", "Public Works", "2026-07-20", "All lights restored after transformer repair."],
  ["CIV-2026-004055", "Open manhole poses safety risk", "Community", "Road Infrastructure", "Victoria Island, Lagos", 64, 60, "Critical", "Investigation", "Public Works", "2026-08-15", "Uncovered manhole on a busy walkway near the market."],
  ["CIV-2026-003998", "Telecom billing dispute unresolved", "Consumer", "Telecommunications", "Apapa, Lagos", 30, 60, "Normal", "Closed", "—", "2026-07-18", "Dispute resolved after provider issued a correction."],
];

export function seedReports() {
  return RAW.map((r) => ({
    id: r[0], title: r[1], type: r[2], category: r[3], location: r[4],
    x: r[5], y: r[6], priority: r[7], status: r[8], department: r[9],
    date: r[10], description: r[11],
  }));
}
