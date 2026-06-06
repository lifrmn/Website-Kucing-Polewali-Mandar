import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Memuat...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border">
          <div className="h-10 w-10 bg-surface2 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface2 rounded w-1/4 animate-pulse" />
            <div className="h-3 bg-surface2 rounded w-1/3 animate-pulse" />
          </div>
          <div className="h-8 w-20 bg-surface2 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
