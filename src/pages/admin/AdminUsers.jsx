import React from "react";
import { AdminTablePage } from "../../components/AdminTablePage.jsx";
import { USERS } from "../../data/users.js";

export default function AdminUsers() {
  return (
    <AdminTablePage
      title="Users"
      cols={["Name", "Role", "Department", "Status"]}
      rows={USERS.map((u) => [u.name, u.role, u.department, u.status])}
    />
  );
}
