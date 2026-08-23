#!/usr/bin/env bash
set -euo pipefail

# Nice Crochet - Image Processing Pipeline
# Converts source photos (HEIC, JPG, PNG) into 3 deterministic WebP sizes:
# - thumb (~72px max width) for search suggestions
# - card (~600px max width) for shop grid & modal cards
# - hero (~1600px max width) for hero carousel & full-bleed displays

SOURCE_DIR="${1:-/Users/supavit.cho/.claude/jobs/8adedd7b/tmp/selected}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/images"

echo "🌸 Nice Crochet Image Pipeline"
echo "Source directory: $SOURCE_DIR"
echo "Output directory: $OUT_DIR"

mkdir -p "$OUT_DIR/thumb" "$OUT_DIR/card" "$OUT_DIR/hero"
TEMP_DIR="$(mktemp -d /tmp/nice-crochet-build-images.XXXXXX)"
trap 'rm -rf "$TEMP_DIR"' EXIT

# Copy logo files directly
if [ -f "$SOURCE_DIR/logo-topbar.png" ]; then
  cp "$SOURCE_DIR/logo-topbar.png" "$OUT_DIR/logo-topbar.png"
  echo "✓ Copied logo-topbar.png"
fi

for f in "$SOURCE_DIR"/*; do
  [ -e "$f" ] || continue
  filename="$(basename "$f")"
  
  # Skip non-image files and logo pngs that shouldn't be converted to product webps
  case "$filename" in
    logo-*.png)
      continue
      ;;
    *.HEIC|*.heic|*.jpg|*.jpeg|*.JPG|*.JPEG|*.png|*.PNG)
      ;;
    *)
      continue
      ;;
  esac

  # Normalize name to lowercase kebab-case without extension
  base="${filename%.*}"
  # Replace spaces and underscores with hyphens, remove special characters, lowercase
  clean_name="$(echo "$base" | tr '[:upper:]' '[:lower:]' | tr ' _' '--' | tr -cd 'a-z0-9-')"
  # Collapse multiple hyphens
  clean_name="$(echo "$clean_name" | sed -E 's/-+/-/g' | sed -E 's/^-|-$//g')"

  target_webp="${clean_name}.webp"
  echo "Processing: $filename -> $target_webp"

  # Convert HEIC to intermediate JPG using sips if needed
  input_for_cwebp="$f"
  if [[ "$filename" =~ \.[hH][eE][iI][cC]$ ]]; then
    temp_jpg="$TEMP_DIR/${clean_name}.jpg"
    sips -s format jpeg "$f" --out "$temp_jpg" > /dev/null 2>&1
    input_for_cwebp="$temp_jpg"
  fi

  # Bake in EXIF orientation before resizing — neither sips's format conversion
  # nor cwebp applies the orientation flag on its own, so portrait phone photos
  # (stored as landscape pixels + an orientation tag) ship sideways/tilted
  # unless this runs. cwebp reads plain pixels, so this must happen first.
  oriented_jpg="$TEMP_DIR/${clean_name}-oriented.jpg"
  python3 -c "
from PIL import Image, ImageOps
img = ImageOps.exif_transpose(Image.open('$input_for_cwebp'))
img.save('$oriented_jpg', quality=95)
"
  input_for_cwebp="$oriented_jpg"

  # Generate 3 WebP sizes
  cwebp -quiet -q 80 -resize 72 0 "$input_for_cwebp" -o "$OUT_DIR/thumb/$target_webp"
  cwebp -quiet -q 82 -resize 600 0 "$input_for_cwebp" -o "$OUT_DIR/card/$target_webp"
  cwebp -quiet -q 85 -resize 1600 0 "$input_for_cwebp" -o "$OUT_DIR/hero/$target_webp"

  echo "  ✓ Generated thumb (72w), card (600w), hero (1600w) for $target_webp"
done

echo "🎉 Image build completed successfully!"
