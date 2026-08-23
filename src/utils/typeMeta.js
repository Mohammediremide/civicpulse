import { Construction, Landmark, CreditCard } from "lucide-react";

// Metadata for the three core complaint types. Centralized so the
// wizard, badges, cards and filters all describe them identically.
export const TYPE_META = {
  Community:  { label: "Community Issue",     color: "#1F4FD8", icon: Construction },
  Government: { label: "Government Service",  color: "#0E9C8C", icon: Landmark },
  Consumer:   { label: "Consumer Complaint",   color: "#7C3AED", icon: CreditCard },
};

export const CATEGORY_OPTIONS = {
  Community: ["Road Infrastructure", "Flooding & Drainage", "Street Lighting", "Waste Management", "Water Infrastructure", "Public Facilities", "Environmental", "Traffic & Safety"],
  Government: ["Public Hospital", "Public School", "Government Office", "Local Government", "Other Public Service"],
  Consumer: ["Telecommunications", "Banking & Finance", "Retail & E-commerce", "Billing Dispute", "Transport Company", "Other Service"],
};
