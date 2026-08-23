import React from "react";
import { AdminTablePage } from "../../components/AdminTablePage.jsx";
import { DEPARTMENTS } from "../../data/departments.js";

export default function AdminDepartments() {
  return (
    <AdminTablePage
      title="Departments"
      cols={["Department", "Received", "Active", "Resolved", "Rate", "Avg. days"]}
      rows={DEPARTMENTS.map((d) => [d.name, d.received.toLocaleString(), d.active, d.resolved.toLocaleString(), `${d.rate}%`, `${d.avgDays}d`])}
    />
  );
}
