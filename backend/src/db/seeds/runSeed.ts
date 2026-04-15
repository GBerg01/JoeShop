import { pool, query } from '../index';
import { generateMockProducts, generateProductStats } from './mockProducts';

async function runSeed() {
  console.log('Starting seed...');

  try {
    // Clear existing data
    await query('TRUNCATE product_stats, interactions, saves, products CASCADE');
    console.log('Cleared existing product data');

    const products = generateMockProducts(200);

    // Insert products in batches of 50
    for (let i = 0; i < products.length; i += 50) {
      const batch = products.slice(i, i + 50);
      for (const p of batch) {
        await query(
          `INSERT INTO products (
            id, external_id, brand, name, description, category, subcategory,
            sizes_available, image_urls, original_price, discounted_price,
            discount_pct, affiliate_url, source, stock_level, is_active, created_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [
            p.id, p.external_id, p.brand, p.name, p.description,
            p.category, p.subcategory, p.sizes_available, p.image_urls,
            p.original_price, p.discounted_price, p.discount_pct,
            p.affiliate_url, p.source, p.stock_level, p.is_active, p.created_at
          ]
        );
      }
      console.log(`Inserted products ${i + 1}–${Math.min(i + 50, products.length)}`);
    }

    // Insert product stats
    const activeProducts = products.filter(p => p.is_active);
    const stats = generateProductStats(activeProducts.map(p => p.id));

    for (const s of stats) {
      await query(
        `INSERT INTO product_stats (product_id, view_count, save_count, click_count)
         VALUES ($1, $2, $3, $4)`,
        [s.product_id, s.view_count, s.save_count, s.click_count]
      );
    }

    console.log(`\nSeed complete!`);
    console.log(`  Products: ${products.length}`);
    console.log(`  Active: ${activeProducts.length}`);
    console.log(`  Stats rows: ${stats.length}`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSeed();
