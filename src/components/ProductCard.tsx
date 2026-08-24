'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Product, getColourHex } from '@/types/product';
import { ResponsiveImage } from './ResponsiveImage';

interface ProductCardProps {
  product: Product;
  onOpenLightbox: (product: Product) => void;
  staggerIndex?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenLightbox, staggerIndex = 0 }) => {
  const primaryColor = product.colours[0] || 'Cherry';
  const colorHex = getColourHex(primaryColor);
  const primaryPhoto = product.photos[0];
  const photoCount = product.photos.length;

  const cardRef = useRef<HTMLButtonElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // Reveal once, on first entry — a card scrolled past shouldn't
    // re-animate every time it re-enters the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      className={`product-card${isRevealed ? ' is-revealed' : ''}`}
      style={{ '--reveal-delay': `${staggerIndex * 70}ms` } as React.CSSProperties}
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
