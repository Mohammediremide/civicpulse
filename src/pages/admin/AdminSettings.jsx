import React from "react";
import { Settings } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function AdminSettings() {
  return <EmptyState title="Settings" sub="Account, notification, and integration settings would live here." icon={Settings} />;
}
