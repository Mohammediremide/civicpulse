export function SkeletonLine({ className = '' }) {
  return <div className={`skeleton rounded-md ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-5">
      <SkeletonLine className="h-4 w-24 mb-3" />
      <SkeletonLine className="h-7 w-16 mb-2" />
      <SkeletonLine className="h-3 w-32" />
    </div>
  )
}

export function SkeletonTableRow({ cols = 6 }) {
  return (
    <tr className="border-b border-mist-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <SkeletonLine className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonBlock({ className = 'h-40 w-full' }) {
  return <div className={`skeleton rounded-2xl ${className}`} />
}
