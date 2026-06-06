import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-surface2 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted mb-6 max-w-md leading-relaxed">{description}</p>
      {action && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button onClick={action.onClick} size="lg">{action.label}</Button>
          {secondaryAction && (
            <Button variant="ghost" size="lg" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
