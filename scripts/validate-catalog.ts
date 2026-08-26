import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const VALID_CATEGORIES = [
  'Market totes & bags',
  'Pouches & purses',
  'Card holders',
  'Flower charms',
] as const;

const VALID_COLOURS = [
  'Cherry',
  'Mustard',
  'Camel',
  'Tan',
  'Charcoal',
] as const;

const ProductSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, {
    message: 'id must be lowercase alphanumeric with hyphens',
  }),
  name: z.string().min(1, 'name cannot be empty'),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({
      message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    }),
  }),
  colours: z.array(z.string().min(1)).min(1, 'colours must have at least 1 colour'),
  photos: z
    .array(z.string().min(1).regex(/\.webp$/, 'photo filename must end in .webp'))
    .min(1, 'photos must contain at least 1 photo'),
  alt: z.string().min(1, 'alt text is required'),
  description: z.string().optional(),
  showOnShelf: z.boolean(),
  showOnHome: z.boolean(),
}).refine((p) => !p.showOnHome || p.showOnShelf, {
  message: 'showOnHome requires showOnShelf to also be true — a piece cannot be featured on Home without being browsable on the Shelf',
  path: ['showOnHome'],
});

const CatalogSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;

function validateCatalog() {
  console.log('🔍 Validating Nice Crochet catalog (products.json)...');

  const catalogPath = path.join(ROOT_DIR, 'products.json');
  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Catalog file not found at: ${catalogPath}`);
    process.exit(1);
  }

  let rawData: unknown;
  try {
    const fileContent = fs.readFileSync(catalogPath, 'utf-8');
    rawData = JSON.parse(fileContent);
  } catch (err) {
    console.error(`❌ Failed to parse products.json as JSON:`, err);
    process.exit(1);
  }

  const parseResult = CatalogSchema.safeParse(rawData);
  if (!parseResult.success) {
    console.error('❌ Catalog schema validation errors:');
    for (const error of parseResult.error.errors) {
      console.error(`  - Path: ${error.path.join('.')}: ${error.message}`);
    }
    process.exit(1);
  }

  const products = parseResult.data;
  console.log(`✓ Schema valid for ${products.length} products`);

  const seenIds = new Set<string>();
  const missingFiles: string[] = [];

  const publicImagesDir = path.join(ROOT_DIR, 'public', 'images');
  const sizes = ['thumb', 'card', 'hero'];

  for (const product of products) {
    if (seenIds.has(product.id)) {
      console.error(`❌ Duplicate product id found: "${product.id}"`);
      process.exit(1);
    }
    seenIds.add(product.id);

    for (const photo of product.photos) {
      for (const size of sizes) {
        const filePath = path.join(publicImagesDir, size, photo);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(
            `❌ Error in product "${product.id}": photo "${photo}" not found at public/images/${size}/${photo}`
          );
        }
      }
    }
  }

  if (missingFiles.length > 0) {
    console.error(`\n❌ Photo file existence check failed:`);
    for (const err of missingFiles) {
      console.error(`  ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `✅ Catalog validation passed: ${products.length} products verified with all photos present on disk.\n`
  );

  validateHardcodedImageRefs();
}

/**
 * Catches the class of bug where a component hardcodes a .webp filename
 * outside products.json (e.g. AboutSection's hero photo, HeroCarousel's
 * per-category fallback) and that file later gets deleted as "unused" by
 * someone only checking products.json references. Static grep, not an AST
 * parse — good enough for a handful of literal filenames.
 */
function validateHardcodedImageRefs() {
  const srcDir = path.join(ROOT_DIR, 'src');
  const cardDir = path.join(ROOT_DIR, 'public', 'images', 'card');
  const missing: string[] = [];

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(full, 'utf-8');
        const matches = content.matchAll(/['"]([\w-]+\.webp)['"]/g);
        for (const match of matches) {
          const filename = match[1];
          if (!fs.existsSync(path.join(cardDir, filename))) {
            missing.push(`❌ ${path.relative(ROOT_DIR, full)} references "${filename}", not found at public/images/card/${filename}`);
          }
        }
      }
    }
  }

  walk(srcDir);

  if (missing.length > 0) {
    console.error(`\n❌ Hardcoded image reference check failed:`);
    for (const err of missing) {
      console.error(`  ${err}`);
    }
    process.exit(1);
  }

  console.log('✅ Hardcoded image references (About/Stats/HeroCarousel fallbacks) all present on disk.\n');
}

validateCatalog();
