'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCategory } from '@/types/product';

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  btnText: string;
  category: ProductCategory;
  label: string;
}

const SLIDES: Slide[] = [
  {
    image: '/images/hero/lattice-yellow-tote.webp',
    eyebrow: 'Handmade with love',
    title: 'Every piece hand‑looped, never mass‑made.',
    description: "Market totes turn a single skein into a proper carry-all — the same pieces you've seen on @yukiandnice.",
    btnText: 'Browse totes',
    category: 'Market totes & bags',
    label: 'Slide 1: Totes',
  },
  {
    image: '/images/hero/mustard-pouch.webp',
    eyebrow: 'The essentials',
    title: 'Small enough for everyday.',
    description: 'Pouches and purses, closed with a hand-looped button loop — no zippers, no hardware.',
    btnText: 'Browse pouches',
    category: 'Pouches & purses',
    label: 'Slide 2: Pouches',
  },
  {
    image: '/images/hero/card-holders.webp',
    eyebrow: 'Carry less',
    title: 'One card holder, two colourways.',
    description: 'A flap-tab closure, finished with a pom-pom or a flower charm keychain.',
    btnText: 'Browse card holders',
    category: 'Card holders',
    label: 'Slide 3: Card holders',
  },
  {
    image: '/images/hero/flower-charm.webp',
    eyebrow: 'The signature',
    title: 'Finished with a flower.',
    description: 'The crochet flower that shows up across the whole shelf — also sold on its own as a charm.',
    btnText: 'Browse charms',
    category: 'Flower charms',
    label: 'Slide 4: Flower charms',
  },
];

interface HeroCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelectCategory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

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
        return (
          <div
            key={slide.label}
            className={`carousel-slide ${isActive ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={!isActive}
          >
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
