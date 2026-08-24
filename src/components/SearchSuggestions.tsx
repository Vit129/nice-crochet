'use client';

import React from 'react';
import { Product, getColourHex } from '@/types/product';
import { ResponsiveImage } from './ResponsiveImage';

interface SearchSuggestionsProps {
  query: string;
  suggestions: Product[];
  isOpen: boolean;
  onSelectProduct: (product: Product) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  isOpen,
  onSelectProduct,
}) => {
  if (!isOpen || !query.trim()) {
    return null;
  }

  if (suggestions.length === 0) {
    return (
      <div className="search-suggestions" role="listbox" id="search-suggestions">
        <div className="suggestion-empty">No pieces match “{query.trim()}.”</div>
      </div>
    );
  }

  return (
    <div className="search-suggestions" role="listbox" id="search-suggestions">
      {suggestions.map((p) => {
        const primaryColor = p.colours[0] || 'Cherry';
        const colorHex = getColourHex(primaryColor);
        const primaryPhoto = p.photos[0];

        return (
          <button
            key={p.id}
            type="button"
            className="suggestion-item"
            role="option"
            aria-selected="false"
            onClick={() => onSelectProduct(p)}
          >
            <span className="suggestion-thumb">
              <ResponsiveImage
                filename={primaryPhoto}
                alt={p.name}
                sizeVariant="thumb"
              />
            </span>
            <span className="suggestion-text">
              <span className="suggestion-name">{p.name}</span>
              <span className="suggestion-meta">
                <span className="dot" style={{ background: colorHex }} />
                {p.category}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
