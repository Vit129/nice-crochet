'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product, getColourHex } from '@/types/product';
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
  const colorHex = getColourHex(primaryColor);
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
              <strong>Made to order, just for you</strong>
              <p>
                This piece is hand-looped from a single skein, start to finish
                — no two turn out quite the same. Custom colors and sizing are
                always welcome.
              </p>
              <a
                className="btn btn-primary"
                href="https://www.tiktok.com/@yukiandnice"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16.6 5.82a4.28 4.28 0 0 1-4.28-4.28h-3.4v14.2a2.6 2.6 0 1 1-2.6-2.6c.2 0 .4.02.6.06V9.72a6.2 6.2 0 1 0 5.4 6.15V9.4a7.66 7.66 0 0 0 4.28 1.3V7.3a4.28 4.28 0 0 1 0-1.48Z" />
                </svg>
                Message @yukiandnice on TikTok
              </a>
              <a
                className="btn btn-primary"
                href="https://www.instagram.com/nic.ecrochet/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.719-.891.923-1.417.198-.509.333-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.174-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                </svg>
                Message @nic.ecrochet on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
