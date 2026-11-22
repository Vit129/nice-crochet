import React, { useMemo } from 'react';
import { Product } from '@/types/product';
import { th } from '@/strings/th';

interface StatsRowProps {
  products: Product[];
}

export const StatsRow: React.FC<StatsRowProps> = ({ products }) => {
  // Derived from the real catalog, not hand-maintained — a new category or
  // colourway shows up here automatically instead of needing someone to
  // remember to bump a hardcoded number (the previous "7+" colourways had
  // already drifted from the real count of 5 before this changed).
  const categoryCount = useMemo(
    () => new Set(products.map((p) => p.category)).size,
    [products]
  );
  const colourCount = useMemo(
    () => new Set(products.flatMap((p) => p.colours)).size,
    [products]
  );

  return (
    <div className="wrap">
      <div className="craft-spotlight">
        <div className="craft-spotlight-body">
          <p className="craft-spotlight-caption">
            {th.stats.caption}
          </p>
          <div className="stat-row">
            <div className="stat">
              <b>{categoryCount}</b>
              <span>{th.stats.categories}</span>
            </div>
            <div className="stat">
              <b>{colourCount}</b>
              <span>{th.stats.colours}</span>
            </div>
            <div className="stat">
              <b>100%</b>
              <span>{th.stats.handmade}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
