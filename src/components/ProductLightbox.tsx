'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, COLOUR_SWATCHES } from '@/types/product';
import { ResponsiveImage } from './ResponsiveImage';

interface ProductLightboxProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({ product, onClose }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Reset photo index whenever a new product is selected
  useEffect(() => {
    setPhotoIndex(0);
  }, [product]);

  const photos = product?.photos || [];
  const photoCount = photos.length;

  const nextPhoto = useCallback(() => {
    if (photoCount <= 1) return;
    setPhotoIndex((prev) => (prev + 1) % photoCount);
  }, [photoCount]);

  const prevPhoto = useCallback(() => {
    if (photoCount <= 1) return;
    setPhotoIndex((prev) => (prev - 1 + photoCount) % photoCount);
  }, [photoCount]);

  useEffect(() => {
    if (!product) return;

    // Focus close button on mount
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose, nextPhoto, prevPhoto]);

  if (!product) return null;

  const primaryColor = product.colours[0] || 'Cherry';
  const colorHex = COLOUR_SWATCHES[primaryColor] || '#3B8FA1';
  const currentPhoto = photos[photoIndex] || photos[0];

  return (
    <div
      className="lightbox-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
        ref={dialogRef}
      >
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close dialog"
          ref={closeBtnRef}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="lightbox-body">
          <div className="lightbox-media">
            <ResponsiveImage
              filename={currentPhoto}
              alt={`${product.name} - Photo ${photoIndex + 1} of ${photoCount}`}
              sizeVariant="hero"
              className="lightbox-image"
              priority
            />

            <span className="product-tag">{primaryColor}</span>

            {photoCount > 1 && (
              <div className="carousel-controls">
                <button
                  type="button"
                  className="carousel-arrow prev"
                  aria-label="Previous photo"
                  onClick={prevPhoto}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>

                <div className="carousel-dots" role="tablist" aria-label="Product photos">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`carousel-dot ${idx === photoIndex ? 'active' : ''}`}
                      role="tab"
                      aria-selected={idx === photoIndex}
                      aria-label={`Photo ${idx + 1}`}
                      onClick={() => setPhotoIndex(idx)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="carousel-arrow next"
                  aria-label="Next photo"
                  onClick={nextPhoto}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="lightbox-info">
            <div className="lightbox-header">
              <div className="lightbox-category-row">
                <span className="dot" style={{ background: colorHex }} />
                <span>{product.category}</span>
                {photoCount > 1 && (
                  <span className="mono" style={{ marginLeft: 'auto', fontSize: '0.78rem' }}>
                    {photoIndex + 1} / {photoCount}
                  </span>
                )}
              </div>
              <h2 id="lightbox-title" className="lightbox-title">
                {product.name}
              </h2>
              {product.description && (
                <p className="lightbox-desc">{product.description}</p>
              )}
            </div>

            <div className="lightbox-contact-hint">
              <strong>Interested in this piece?</strong>
              Every item is hand-looped to order. Custom colors and sizing are welcome.
              <div>
                <a
                  href="https://www.tiktok.com/@yukiandnice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.6 5.82a4.28 4.28 0 0 1-4.28-4.28h-3.4v14.2a2.6 2.6 0 1 1-2.6-2.6c.2 0 .4.02.6.06V9.72a6.2 6.2 0 1 0 5.4 6.15V9.4a7.66 7.66 0 0 0 4.28 1.3V7.3a4.28 4.28 0 0 1 0-1.48Z" />
                  </svg>
                  Message @yukiandnice on TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
