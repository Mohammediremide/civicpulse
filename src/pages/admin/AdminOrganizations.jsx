import React from "react";
import { AdminTablePage } from "../../components/AdminTablePage.jsx";
import { ORGANIZATIONS } from "../../data/organizations.js";

export default function AdminOrganizations() {
  return (
    <AdminTablePage
      title="Organizations"
      cols={["Organization", "Type", "Complaints", "Resolved", "Avg. response"]}
      rows={ORGANIZATIONS.map((o) => [o.name, o.type, o.complaints, o.resolved, o.avgResponse])}
    />
  );
}
