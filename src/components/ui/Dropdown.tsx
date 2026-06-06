'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  fullWidth = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')} ref={dropdownRef}>
      {label && (
        <label className="text-small font-semibold text-text">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'input-premium w-full px-4 py-3 bg-surface border border-border rounded-button text-text',
            'flex items-center justify-between gap-2',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger',
            !selectedOption && 'text-muted'
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform duration-hover',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-dropdown w-full mt-2 bg-surface border border-border rounded-button shadow-card animate-slide-down">
            <div className="py-2 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full px-4 py-3 text-left text-body transition-colors duration-hover',
                    'hover:bg-surface2 disabled:opacity-50 disabled:cursor-not-allowed touch-target',
                    option.value === value && 'bg-primary/10 text-primary font-semibold'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-caption text-danger flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
