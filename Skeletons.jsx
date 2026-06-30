export function CardSkeleton() {
  return <div className="skeleton rounded-2xl h-28 glass" />
}

export function ChartSkeleton({ height = 280 }) {
  return <div className="skeleton rounded-2xl glass" style={{ height }} />
}

export function TextSkeleton({ width = '60%' }) {
  return <div className="skeleton rounded h-4" style={{ width }} />
}
