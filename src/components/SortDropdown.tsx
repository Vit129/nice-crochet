'use client';

import React, { useState, useRef, useEffect } from 'react';

export type SortOption = 'default' | 'popular';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Newest first' },
  { value: 'popular', label: 'Most viewed' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

/**
 * Custom listbox, not a native <select> — a native select's open option
 * list is rendered by the OS and cannot be restyled in any browser, which
 * is exactly why this exists (matches the SearchSuggestions listbox
 * pattern already used for search — same interaction, same accessibility
 * roles, own visual styling instead of OS chrome).
 */
export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div className="sort-dropdown" ref={wrapRef}>
      <button
        type="button"
        className="sort-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {current.label}
        <svg
          className={`sort-dropdown-chevron ${isOpen ? 'is-open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="sort-dropdown-panel" role="listbox">
          {OPTIONS.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`sort-dropdown-option ${isSelected ? 'is-selected' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="sort-dropdown-dot" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
