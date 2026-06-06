import { ReactNode } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';
import Select from './Select';
import Button from './Button';

interface ToolbarFilter {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  width?: 'default' | 'wide' | 'narrow';
}

interface ToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<ToolbarFilter>;
  actions?: ReactNode;
  onReset?: () => void;
}

export default function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters,
  actions,
  onReset,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {onSearchChange && (
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-colors duration-200"
          />
        </div>
      )}
      
      {filters && filters.length > 0 && (
        <>
          {filters.map((filter) => {
            const widthClass =
              filter.width === 'wide'
                ? 'w-full sm:w-[260px] min-w-[220px]'
                : filter.width === 'narrow'
                ? 'w-full sm:w-[220px] min-w-[200px]'
                : 'w-full sm:w-[260px] min-w-[220px]';
            
            return (
              <div key={filter.id} className={widthClass}>
                <Select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  options={filter.options}
                  variant="toolbar"
                  fullWidth
                />
              </div>
            );
          })}
        </>
      )}
      
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
      
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  );
}
