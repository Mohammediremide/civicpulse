import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getInitialReports, generateReferenceNumber } from "../../services/reportsService.js";

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(() => getInitialReports());

  const addReport = useCallback((partialReport) => {
    const id = partialReport.id || generateReferenceNumber();
    const record = {
      status: "Submitted",
      department: "Pending assignment",
      date: new Date().toISOString().slice(0, 10),
      ...partialReport,
      id,
    };
    setReports((prev) => [record, ...prev]);
    return record;
  }, []);

  const updateReport = useCallback((id, changes) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }, []);

  const getReportById = useCallback((id) => reports.find((r) => r.id === id) || null, [reports]);

  const value = useMemo(
    () => ({ reports, addReport, updateReport, getReportById }),
    [reports, addReport, updateReport, getReportById]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within a ReportsProvider");
  return ctx;
}
