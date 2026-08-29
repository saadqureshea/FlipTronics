export default function ListingsSkeleton() {
  return (
    <>
      <div className="h-3 w-32 bg-[var(--panel)] mb-6 -mt-3 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="facet-card bg-[var(--panel)] border border-[var(--line)] overflow-hidden">
            <div className="aspect-[4/3] bg-[var(--panel-2)] animate-pulse" />
            <div className="p-5">
              <div className="h-2.5 w-20 bg-[var(--panel-2)] animate-pulse mb-3" />
              <div className="h-4 w-3/4 bg-[var(--panel-2)] animate-pulse mb-3" />
              <div className="h-3 w-full bg-[var(--panel-2)] animate-pulse mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-[var(--panel-2)] animate-pulse" />
                <div className="h-8 w-24 bg-[var(--panel-2)] animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
