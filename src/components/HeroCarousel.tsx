'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { assetPath } from '@/lib/basePath';

interface Slide {
  /** Filename fallback used only if no showOnHome-flagged product exists for this category yet. */
  fallbackImage: string;
  /** Manual override: when set, this single photo is the slide's whole pool,
   *  regardless of which products in `category` are showOnHome-flagged. Used
   *  when the best photo for a slide's story lives on a product outside its
   *  own category (e.g. the flower charm shown as an accent on a tote). */
  pinnedPhoto?: string;
  eyebrow: string;
  title: string;
  description: string;
  btnText: string;
  category: ProductCategory;
  label: string;
}

const SLIDES: Slide[] = [
  {
    fallbackImage: 'lattice-yellow-tote.webp',
    eyebrow: 'Handmade with love',
    title: 'Every piece hand‑looped, never mass‑made.',
    description: "Market totes turn a single skein into a proper carry-all — the same pieces you've seen on @yukiandnice.",
    btnText: 'Browse totes',
    category: 'Market totes & bags',
    label: 'Slide 1: Totes',
  },
  {
    fallbackImage: 'mustard-pouch.webp',
    eyebrow: 'The essentials',
    title: 'Small enough for everyday.',
    description: 'Pouches and purses, closed with a hand-looped button loop — no zippers, no hardware.',
    btnText: 'Browse pouches',
    category: 'Pouches & purses',
    label: 'Slide 2: Pouches',
  },
  {
    fallbackImage: 'card-holders.webp',
    eyebrow: 'Carry less',
    title: 'One card holder, two colourways.',
    description: 'A flap-tab closure, finished with a pom-pom or a flower charm keychain.',
    btnText: 'Browse card holders',
    category: 'Card holders',
    label: 'Slide 3: Card holders',
  },
  {
    fallbackImage: 'flower-charm.webp',
    pinnedPhoto: 'tan-shoulder-tote-brown-white-flower-standing-marble-1.webp',
    eyebrow: 'The signature',
    title: 'Finished with a flower.',
    description: 'The crochet flower that shows up across the whole shelf — also sold on its own as a charm.',
    btnText: 'Browse charms',
    category: 'Flower charms',
    label: 'Slide 4: Flower charms',
  },
];

interface HeroCarouselProps {
  products: Product[];
  onSelectCategory: (category: ProductCategory) => void;
}

/** Filenames of every showOnHome-flagged product's primary photo, per category —
 *  falls back to the single hardcoded image if nothing's flagged for that category yet. */
function useSlideImagePools(products: Product[]) {
  return useMemo(() => {
    return SLIDES.map((slide) => {
      if (slide.pinnedPhoto) return [slide.pinnedPhoto];
      const pool = products
        .filter((p) => p.category === slide.category && p.showOnHome && p.photos[0])
        .sort((a, b) => (a.homePriority ?? Infinity) - (b.homePriority ?? Infinity))
        .map((p) => p.homePhoto || p.photos[0]);
      return pool.length > 0 ? pool : [slide.fallbackImage];
    });
  }, [products]);
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products, onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const imagePools = useSlideImagePools(products);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Reset to the pool's first photo whenever we land on a new slide.
  useEffect(() => {
    setBgIndex(0);
  }, [currentIndex]);

  // While a slide with more than one flagged photo is active, quietly cycle
  // its background through the pool — gives repeat visitors visible variety
  // without adding a second, competing carousel UI.
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pool = imagePools[currentIndex];
    if (prefersReducedMotion || isPaused || pool.length <= 1) return;

    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % pool.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, imagePools]);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartXRef.current === null) return;
    const dx = e.clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Featured pieces"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        const pool = imagePools[index];
        const photo = pool[isActive ? bgIndex % pool.length : 0];
        const photoUrl = assetPath(`/images/hero/${photo}`);
        return (
          <div
            key={slide.label}
            className={`carousel-slide ${isActive ? 'active' : ''}`}
            style={{ '--slide-bg': `url(${photoUrl})` } as React.CSSProperties}
            aria-hidden={!isActive}
          >
            <img
              className="carousel-slide-fg"
              src={photoUrl}
              alt=""
              aria-hidden="true"
              loading={isActive ? 'eager' : 'lazy'}
            />
            <div className="carousel-copy">
              <span className="eyebrow">{slide.eyebrow}</span>
              <h2 className="display">{slide.title}</h2>
              <p>{slide.description}</p>
              <button
                type="button"
                className="btn btn-primary"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelectCategory(slide.category)}
              >
                {slide.btnText}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-arrow prev"
          aria-label="Previous slide"
          onClick={prevSlide}
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

        <div className="carousel-dots" role="tablist" aria-label="Slides">
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.label}
                type="button"
                className={`carousel-dot ${isActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isActive}
                aria-label={slide.label}
                onClick={() => setCurrentIndex(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="carousel-arrow next"
          aria-label="Next slide"
          onClick={nextSlide}
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
    </section>
  );
};
