import React from "react";
import { Bell } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState.jsx";

export default function AdminNotifications() {
  return <EmptyState title="No new notifications" sub="Department alerts and system notices will appear here." icon={Bell} />;
}
