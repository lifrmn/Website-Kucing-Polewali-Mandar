'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('border-b border-border', className)}>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200',
              'hover:text-text',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'ml-2 px-2 py-0.5 rounded-full text-xs',
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'bg-surface2 text-muted'
              )}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
