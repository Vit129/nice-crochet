'use client';

import React, { useState } from 'react';
import productsData from '@/data/products.json';
import { Product, ProductCategory } from '@/types/product';
import { Topbar } from '@/components/Topbar';
import { HeroCarousel } from '@/components/HeroCarousel';
import { StatsRow } from '@/components/StatsRow';
import { ShopGrid } from '@/components/ShopGrid';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';

const products = productsData as Product[];

export default function Home() {
  const [activePage, setActivePage] = useState<'home' | 'shop' | 'about'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

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
          <HeroCarousel onSelectCategory={handleSelectCarouselCategory} />
          <StatsRow />
        </main>
      )}

      {activePage === 'shop' && (
        <main id="page-shop">
          <ShopGrid
            products={products}
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
