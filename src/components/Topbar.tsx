'use client';

import React, { useEffect, useState } from 'react';

interface TopbarProps {
  activePage: 'home' | 'shop' | 'about';
  onNavigate: (page: 'home' | 'shop' | 'about') => void;
}

export const Topbar: React.FC<TopbarProps> = ({ activePage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`topbar ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => onNavigate('home')}
          aria-label="Nice Crochet Home"
        >
          <img
            className="brand-lockup"
            src="/images/logo-topbar.png"
            alt="Nice Crochet"
            width={124}
            height={38}
          />
          <span className="preview-badge">Design preview</span>
        </button>
        <nav className="pages" aria-label="Pages">
          <button
            type="button"
            data-nav="home"
            aria-current={activePage === 'home' ? 'page' : undefined}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            type="button"
            data-nav="shop"
            aria-current={activePage === 'shop' ? 'page' : undefined}
            onClick={() => onNavigate('shop')}
          >
            Shelf
          </button>
          <button
            type="button"
            data-nav="about"
            aria-current={activePage === 'about' ? 'page' : undefined}
            onClick={() => onNavigate('about')}
          >
            About&nbsp;me
          </button>
        </nav>
      </div>
    </header>
  );
};
