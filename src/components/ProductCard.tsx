'use client';

import React from 'react';
import { Product, COLOUR_SWATCHES } from '@/types/product';
import { ResponsiveImage } from './ResponsiveImage';

interface ProductCardProps {
  product: Product;
  onOpenLightbox: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenLightbox }) => {
  const primaryColor = product.colours[0] || 'Cherry';
  const colorHex = COLOUR_SWATCHES[primaryColor] || '#3B8FA1';
  const primaryPhoto = product.photos[0];
  const photoCount = product.photos.length;

  return (
    <button
      type="button"
      className="product-card"
      onClick={() => onOpenLightbox(product)}
      aria-label={`View details and photos for ${product.name}`}
    >
      <div className="product-photo">
        <ResponsiveImage
          filename={primaryPhoto}
          alt={product.alt || product.name}
          sizeVariant="card"
        />
        <span className="product-tag">{primaryColor}</span>
        {photoCount > 1 && (
          <span className="product-photo-count" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            {photoCount}
          </span>
        )}
      </div>
      <div className="product-body">
        <span className="product-name">{product.name}</span>
        <span className="product-meta">
          <span className="dot" style={{ background: colorHex }} />
          {product.category}
        </span>
      </div>
    </button>
  );
};
