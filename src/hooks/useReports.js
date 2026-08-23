import { useEffect, useState, useCallback } from 'react'
import { getAllReports, getReport as fetchReport } from '../services/reportService'

// Fetches the report list once (optionally with filters) and exposes
// loading/error state plus a refetch function for after admin actions.
export function useReports(filters) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    getAllReports(filters)
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  useEffect(() => { load() }, [load])

  return { reports, loading, error, refetch: load }
}

export function useReport(refOrId) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    if (!refOrId) return
    setLoading(true)
    setError(null)
    fetchReport(refOrId)
      .then((r) => {
        if (!r) setError('Report not found.')
        setReport(r)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [refOrId])

  useEffect(() => { load() }, [load])

  return { report, setReport, loading, error, refetch: load }
}
