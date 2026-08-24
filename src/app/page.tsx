'use client';

import React, { useState, useEffect, useMemo } from 'react';
import productsData from '../../products.json';
import { Product, ProductCategory } from '@/types/product';
import { Topbar } from '@/components/Topbar';
import { HeroCarousel } from '@/components/HeroCarousel';
import { StatsRow } from '@/components/StatsRow';
import { ShopGrid } from '@/components/ShopGrid';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { fetchProductFlags, ProductFlags } from '@/lib/clickTracking';

const allProducts = productsData as Product[];

export default function Home() {
  const [activePage, setActivePage] = useState<'home' | 'shop' | 'about'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  // Live overrides for showOnShelf/showOnHome, fetched from a Google Sheet
  // (see src/lib/clickTracking.ts) — layered on top of products.json's own
  // flags, which stay the fallback if the fetch fails or isn't configured.
  const [flagOverrides, setFlagOverrides] = useState<Record<string, ProductFlags>>({});

  useEffect(() => {
    fetchProductFlags().then(setFlagOverrides);
  }, []);

  const mergedProducts = useMemo(
    () =>
      allProducts.map((p) => {
        const override = flagOverrides[p.id];
        return override ? { ...p, ...override } : p;
      }),
    [flagOverrides]
  );

  const shelfProducts = useMemo(
    () => mergedProducts.filter((p) => p.showOnShelf),
    [mergedProducts]
  );

  const handleNavigate = (page: 'home' | 'shop' | 'about') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCarouselCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Topbar activePage={activePage} onNavigate={handleNavigate} />

      {activePage === 'home' && (
        <main id="page-home">
          <h1 className="visually-hidden">Nice Crochet — handmade, hand-looped crochet showcase</h1>
          <HeroCarousel products={mergedProducts} onSelectCategory={handleSelectCarouselCategory} />
          <StatsRow />
        </main>
      )}

      {activePage === 'shop' && (
        <main id="page-shop">
          <ShopGrid
            products={shelfProducts}
            selectedCategory={selectedCategory}
            onClearCategorySelect={() => setSelectedCategory(null)}
          />
        </main>
      )}

      {activePage === 'about' && (
        <main id="page-about">
          <AboutSection />
        </main>
      )}

      <Footer />
    </>
  );
}
