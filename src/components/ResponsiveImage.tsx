import React from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  filename: string;
  alt: string;
  sizeVariant?: 'thumb' | 'card' | 'hero' | 'auto';
  className?: string;
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  filename,
  alt,
  sizeVariant = 'auto',
  className,
  priority = false,
  ...props
}) => {
  // If it's a full path (e.g. /images/logo-topbar.png), render directly
  if (filename.startsWith('/') || filename.startsWith('http') || filename.startsWith('data:')) {
    return (
      <img
        src={filename}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />
    );
  }

  // Pre-sized WebP paths
  const thumbSrc = `/images/thumb/${filename}`;
  const cardSrc = `/images/card/${filename}`;
  const heroSrc = `/images/hero/${filename}`;

  let defaultSrc = cardSrc;
  let srcSet: string | undefined = `${thumbSrc} 72w, ${cardSrc} 600w, ${heroSrc} 1600w`;
  let sizes: string | undefined = '(max-width: 768px) 100vw, 600px';

  if (sizeVariant === 'thumb') {
    defaultSrc = thumbSrc;
    srcSet = undefined;
    sizes = undefined;
  } else if (sizeVariant === 'card') {
    defaultSrc = cardSrc;
    srcSet = `${thumbSrc} 72w, ${cardSrc} 600w`;
    sizes = '(max-width: 640px) 50vw, 400px';
  } else if (sizeVariant === 'hero') {
    defaultSrc = heroSrc;
    srcSet = `${cardSrc} 600w, ${heroSrc} 1600w`;
    sizes = '100vw';
  }

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...props}
    />
  );
};
