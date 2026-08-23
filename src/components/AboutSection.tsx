import React from 'react';
import { ResponsiveImage } from './ResponsiveImage';

export const AboutSection: React.FC = () => {
  return (
    <section className="about wrap">
      <div className="about-grid">
        <div className="hoop" aria-hidden="true">
          <ResponsiveImage
            filename="yarn-stash.webp"
            alt="Hand-selected crochet yarn stash and materials"
            sizeVariant="card"
          />
        </div>
        <div className="about-copy">
          <span className="eyebrow">The maker</span>
          <h1 className="display">Hi, I&apos;m Yuki.</h1>
          <p>
            I&apos;ve been crocheting since 2019 — first as a way to sit still while
            watching TikTok, now as most of what fills my evenings. Everything on this
            shelf is looped by hand, one skein at a time, usually with a video going on in
            the background for @yukiandnice.
          </p>
          <p>
            I keep batches small on purpose: it&apos;s the only way every tote still gets a
            shape I&apos;m happy with, and every flower gets a petal count I&apos;d sign my
            name to.
          </p>
          <p className="pull">
            “If a piece isn&apos;t something I&apos;d keep for myself, it doesn&apos;t go on the
            shelf.”
          </p>
        </div>
      </div>

      <div className="about-contact">
        <span className="kicker">Get in touch</span>
        <h2 className="display">Say hi, or ask about a custom piece.</h2>
        <p>
          Everything here is made to order — colours, sizes and one-off requests are usually
          possible. The fastest way to reach me is TikTok.
        </p>
        <a
          className="tiktok-chip"
          href="https://www.tiktok.com/@yukiandnice"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.6 5.82a4.28 4.28 0 0 1-4.28-4.28h-3.4v14.2a2.6 2.6 0 1 1-2.6-2.6c.2 0 .4.02.6.06V9.72a6.2 6.2 0 1 0 5.4 6.15V9.4a7.66 7.66 0 0 0 4.28 1.3V7.3a4.28 4.28 0 0 1 0-1.48Z" />
          </svg>
          @yukiandnice on TikTok
        </a>
      </div>
    </section>
  );
};
