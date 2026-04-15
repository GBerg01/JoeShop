import { v4 as uuidv4 } from 'uuid';

// Simulates real affiliate network product feeds (ShareASale / CJ style)
// Each brand has realistic product names, real site URLs, and CJ-style affiliate links

const BRAND_CATALOG: Record<string, {
  domain: string;
  affiliateId: string; // simulates CJ/ShareASale publisher ID
  categories: string[];
  products: Array<{
    name: string;
    category: string;
    subcategory: string;
    slug: string;
    original_price: number;
    sale_price: number;
    sizes: string[];
    description: string;
    imageId: string; // picsum seed
  }>;
}> = {
  'ASOS': {
    domain: 'asos.com',
    affiliateId: 'cj-asos-pub-38821',
    categories: ['tops', 'dresses', 'bottoms', 'shoes'],
    products: [
      { name: 'ASOS DESIGN Wrap Midi Dress', category: 'dresses', subcategory: 'midi dress', slug: 'asos-wrap-midi-dress-floral/prd/12345', original_price: 65.00, sale_price: 26.00, sizes: ['XS','S','M','L','XL'], description: 'Floral wrap midi dress with tie waist. Perfect for summer.', imageId: 'asos-dress-1' },
      { name: 'ASOS DESIGN Oversized Blazer', category: 'tops', subcategory: 'jacket', slug: 'asos-oversized-blazer-check/prd/23456', original_price: 85.00, sale_price: 34.00, sizes: ['XS','S','M','L'], description: 'Oversized check blazer with padded shoulders.', imageId: 'asos-blazer-1' },
      { name: 'ASOS DESIGN Wide Leg Trousers', category: 'bottoms', subcategory: 'trousers', slug: 'asos-wide-leg-trousers-cream/prd/34567', original_price: 45.00, sale_price: 18.00, sizes: ['6','8','10','12','14','16'], description: 'Wide leg trousers in cream with elasticated waist.', imageId: 'asos-trousers-1' },
      { name: 'ASOS 4505 Ribbed Sports Bra', category: 'tops', subcategory: 'crop top', slug: 'asos-4505-ribbed-sports-bra/prd/45678', original_price: 22.00, sale_price: 9.00, sizes: ['XS','S','M','L','XL'], description: 'Medium support ribbed sports bra with removable padding.', imageId: 'asos-bra-1' },
      { name: 'ASOS DESIGN Satin Slip Dress', category: 'dresses', subcategory: 'slip dress', slug: 'asos-satin-slip-dress-black/prd/56789', original_price: 55.00, sale_price: 22.00, sizes: ['XS','S','M','L'], description: 'Satin slip dress with lace trim and adjustable straps.', imageId: 'asos-slip-1' },
    ]
  },
  'Zara': {
    domain: 'zara.com',
    affiliateId: 'sa-zara-pub-19283',
    categories: ['tops', 'dresses', 'bottoms', 'shoes', 'accessories'],
    products: [
      { name: 'ZW Collection High Rise Straight Jeans', category: 'bottoms', subcategory: 'jeans', slug: 'en/woman/jeans/straight/zw-collection-high-rise-straight-jeans-p02094093', original_price: 59.90, sale_price: 29.99, sizes: ['34','36','38','40','42','44'], description: 'High rise straight leg jeans in medium blue wash. 5-pocket style.', imageId: 'zara-jeans-1' },
      { name: 'Textured Cropped Jacket', category: 'tops', subcategory: 'jacket', slug: 'en/woman/jackets/textured-cropped-jacket-p02910197', original_price: 79.90, sale_price: 39.99, sizes: ['XS','S','M','L','XL'], description: 'Cropped jacket in textured fabric with lapel collar and front pockets.', imageId: 'zara-jacket-1' },
      { name: 'Flowing Midi Skirt', category: 'bottoms', subcategory: 'skirt', slug: 'en/woman/skirts/midi/flowing-midi-skirt-p02930268', original_price: 49.90, sale_price: 19.99, sizes: ['XS','S','M','L','XL'], description: 'Midi skirt in flowing fabric with elastic waistband.', imageId: 'zara-skirt-1' },
      { name: 'Knit Sweater Dress', category: 'dresses', subcategory: 'midi dress', slug: 'en/woman/dresses/knit/knit-sweater-dress-p02935427', original_price: 69.90, sale_price: 34.99, sizes: ['XS','S','M','L'], description: 'Long knit dress with crew neck and long sleeves.', imageId: 'zara-knit-1' },
      { name: 'Leather Effect Platform Boots', category: 'shoes', subcategory: 'boots', slug: 'en/woman/shoes/boots/leather-effect-platform-boots-p12300421', original_price: 99.90, sale_price: 49.99, sizes: ['36','37','38','39','40','41'], description: 'Ankle boots in leather effect with platform sole and zip closure.', imageId: 'zara-boots-1' },
    ]
  },
  'Free People': {
    domain: 'freepeople.com',
    affiliateId: 'ra-freepeople-pub-55621',
    categories: ['tops', 'dresses', 'bottoms'],
    products: [
      { name: 'We The Free Rumors Tee', category: 'tops', subcategory: 't-shirt', slug: 'products/rumors-tee-76782073', original_price: 48.00, sale_price: 19.99, sizes: ['XS','S','M','L','XL'], description: 'Relaxed tee with raw hem and lived-in feel. Vintage wash finish.', imageId: 'fp-tee-1' },
      { name: 'Movement Never Better Flare Legging', category: 'bottoms', subcategory: 'leggings', slug: 'products/never-better-flare-88271922', original_price: 78.00, sale_price: 39.00, sizes: ['XS','S','M','L','XL'], description: 'High waisted flare legging with smoothing compression fabric.', imageId: 'fp-legging-1' },
      { name: 'Maxi Sundress', category: 'dresses', subcategory: 'maxi dress', slug: 'products/maxi-sundress-12834761', original_price: 128.00, sale_price: 64.00, sizes: ['XS','S','M','L'], description: 'Floaty maxi dress with adjustable straps and smocked back.', imageId: 'fp-maxi-1' },
      { name: 'Intimately Free Slip', category: 'dresses', subcategory: 'slip dress', slug: 'products/intimately-free-slip-98123456', original_price: 68.00, sale_price: 29.00, sizes: ['XS/S','S/M','M/L'], description: 'Silky slip dress with lace trim. Wear alone or layered.', imageId: 'fp-slip-1' },
    ]
  },
  'Revolve': {
    domain: 'revolve.com',
    affiliateId: 'cj-revolve-pub-77341',
    categories: ['dresses', 'tops', 'bottoms'],
    products: [
      { name: 'AGOLDE 90s Pinch Waist High Rise Straight', category: 'bottoms', subcategory: 'jeans', slug: 'agolde-90s-pinch-waist-high-rise-straight-in-agency/dp/AGOL-WJ368', original_price: 198.00, sale_price: 99.00, sizes: ['24','25','26','27','28','29','30'], description: 'Rigid denim with pinch waist and straight leg. 90s inspired fit.', imageId: 'revolve-jeans-1' },
      { name: 'NBD Lena Mini Dress', category: 'dresses', subcategory: 'mini dress', slug: 'nbd-lena-mini-dress/dp/NBDRS-WD3987', original_price: 158.00, sale_price: 79.00, sizes: ['XS','S','M','L'], description: 'Off shoulder mini dress with ruched bodice and tiered skirt.', imageId: 'revolve-mini-1' },
      { name: 'Lovers and Friends Cami Top', category: 'tops', subcategory: 'blouse', slug: 'lovers-and-friends-cami-top/dp/LOVF-WT2819', original_price: 88.00, sale_price: 35.00, sizes: ['XS','S','M','L'], description: 'Adjustable strap cami in satin finish with lace trim.', imageId: 'revolve-cami-1' },
    ]
  },
  'Urban Outfitters': {
    domain: 'urbanoutfitters.com',
    affiliateId: 'sa-uo-pub-44219',
    categories: ['tops', 'bottoms', 'dresses', 'accessories'],
    products: [
      { name: 'BDG High-Waisted Baggy Jean', category: 'bottoms', subcategory: 'jeans', slug: 'shop/product/bdg-high-waisted-baggy-jean/68432197_071', original_price: 79.00, sale_price: 39.00, sizes: ['24','25','26','27','28','29','30','31','32'], description: 'Baggy fit jeans with high rise waist. Relaxed through hip and thigh.', imageId: 'uo-jeans-1' },
      { name: 'Out From Under Cozy Henley Top', category: 'tops', subcategory: 't-shirt', slug: 'shop/product/out-from-under-cozy-henley-top/72819346_020', original_price: 39.00, sale_price: 15.00, sizes: ['XS','S','M','L','XL'], description: 'Super soft henley top in waffle knit with button placket.', imageId: 'uo-henley-1' },
      { name: 'UO Satin Slip Mini Dress', category: 'dresses', subcategory: 'mini dress', slug: 'shop/product/uo-satin-slip-mini-dress/73821947_067', original_price: 59.00, sale_price: 23.00, sizes: ['XS','S','M','L'], description: 'Satin slip mini with adjustable straps and subtle bias cut.', imageId: 'uo-slip-1' },
      { name: 'Sheer Mesh Bucket Hat', category: 'accessories', subcategory: 'hat', slug: 'shop/product/sheer-mesh-bucket-hat/74918273_001', original_price: 24.00, sale_price: 9.99, sizes: ['One Size'], description: 'Sheer mesh bucket hat with structured brim. Sun-ready style.', imageId: 'uo-hat-1' },
    ]
  },
  'Nike': {
    domain: 'nike.com',
    affiliateId: 'cj-nike-pub-28819',
    categories: ['tops', 'bottoms', 'shoes'],
    products: [
      { name: 'Nike Air Force 1 \'07', category: 'shoes', subcategory: 'sneakers', slug: 'launch/t/air-force-1-07-shoe', original_price: 110.00, sale_price: 74.99, sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11'], description: 'The radically reconceived AF1 moves you through your day with premium materials.', imageId: 'nike-af1-1' },
      { name: 'Nike Sportswear Phoenix Fleece Oversized Crew', category: 'tops', subcategory: 'sweater', slug: 'w/nike-sportswear-phoenix-fleece-oversized-crew-dq5761', original_price: 75.00, sale_price: 44.99, sizes: ['XS','S','M','L','XL','XXL'], description: 'Soft fleece crew with dropped shoulders and relaxed oversized fit.', imageId: 'nike-fleece-1' },
      { name: 'Nike Dunk Low Retro', category: 'shoes', subcategory: 'sneakers', slug: 'launch/t/dunk-low-retro-womens-shoe', original_price: 105.00, sale_price: 64.99, sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10'], description: 'Low-cut design for quick lateral cuts. Perforations for breathability.', imageId: 'nike-dunk-1' },
      { name: 'Nike One Dri-FIT Mid-Rise Leggings', category: 'bottoms', subcategory: 'leggings', slug: 'w/nike-one-dri-fit-mid-rise-leggings-dv9017', original_price: 55.00, sale_price: 27.99, sizes: ['XS','S','M','L','XL'], description: 'Supportive mid-rise fit with Dri-FIT technology to keep you dry.', imageId: 'nike-legging-1' },
    ]
  },
  'Adidas': {
    domain: 'adidas.com',
    affiliateId: 'cj-adidas-pub-31928',
    categories: ['tops', 'shoes', 'bottoms'],
    products: [
      { name: 'Adidas Samba OG Shoes', category: 'shoes', subcategory: 'sneakers', slug: 'samba-og-shoes/B75807.html', original_price: 100.00, sale_price: 64.99, sizes: ['5','5.5','6','6.5','7','7.5','8','8.5','9','10'], description: 'Classic Samba silhouette with suede upper and gum sole. Iconic style.', imageId: 'adidas-samba-1' },
      { name: 'Adidas Essentials 3-Stripes Hoodie', category: 'tops', subcategory: 'hoodie', slug: 'essentials-3-stripes-hoodie/IB9303.html', original_price: 65.00, sale_price: 32.50, sizes: ['XS','S','M','L','XL','XXL'], description: 'Regular fit hoodie with kangaroo pocket and 3-Stripes branding.', imageId: 'adidas-hoodie-1' },
      { name: 'Adidas Forum Low Shoes', category: 'shoes', subcategory: 'sneakers', slug: 'forum-low-shoes/FY7757.html', original_price: 90.00, sale_price: 53.99, sizes: ['5','6','7','8','9','10','11'], description: 'Basketball heritage meets streetwear. Leather upper with ankle strap.', imageId: 'adidas-forum-1' },
    ]
  },
  'Mango': {
    domain: 'mango.com',
    affiliateId: 'aw-mango-pub-19273',
    categories: ['tops', 'dresses', 'bottoms', 'accessories'],
    products: [
      { name: 'Knitted Ribbed Dress', category: 'dresses', subcategory: 'midi dress', slug: 'knitted-ribbed-dress_67038278.html', original_price: 59.99, sale_price: 24.99, sizes: ['XS','S','M','L','XL'], description: 'Fitted ribbed knit dress with crew neck and long sleeves.', imageId: 'mango-knit-1' },
      { name: 'Leather Effect Trench Coat', category: 'tops', subcategory: 'jacket', slug: 'leather-effect-trench-coat_77038291.html', original_price: 149.99, sale_price: 74.99, sizes: ['XS','S','M','L','XL'], description: 'Longline trench in leather effect fabric with belt detail.', imageId: 'mango-trench-1' },
      { name: 'Woven Raffia Bag', category: 'accessories', subcategory: 'bag', slug: 'woven-raffia-bag_88192837.html', original_price: 49.99, sale_price: 19.99, sizes: ['One Size'], description: 'Structured tote in woven raffia with zip closure and short handles.', imageId: 'mango-bag-1' },
      { name: 'High Waist Wide Leg Trousers', category: 'bottoms', subcategory: 'trousers', slug: 'high-waist-wide-leg-trousers_67192038.html', original_price: 49.99, sale_price: 22.99, sizes: ['XS','S','M','L','XL'], description: 'Wide leg trousers with high waist and side pockets. Fluid drape.', imageId: 'mango-trousers-1' },
    ]
  },
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}

// Simulates what a real CJ Affiliate product feed URL looks like
function buildAffiliateUrl(brand: string, productSlug: string, affiliateId: string, domain: string): string {
  const trackingBase = 'https://www.anrdoezrs.net/click';
  const encoded = encodeURIComponent(`https://www.${domain}/${productSlug}`);
  return `${trackingBase}-${affiliateId}?url=${encoded}&sid=threaddrop`;
}

// Use Unsplash-style fashion image seeds (fashion-specific categories)
const FASHION_IMAGE_SEEDS = [
  'fashion', 'style', 'clothing', 'outfit', 'model', 'dress', 'shoes',
  'jacket', 'jeans', 'streetwear', 'minimal', 'chic', 'trendy', 'luxury',
  'casual', 'summer', 'winter', 'spring', 'aesthetic', 'vintage'
];

export function generateMockProducts(count = 200) {
  const products = [];
  const brandNames = Object.keys(BRAND_CATALOG);
  let counter = 0;

  // First pass: use real curated products from catalog
  for (const brandName of brandNames) {
    const brand = BRAND_CATALOG[brandName];
    for (const product of brand.products) {
      if (counter >= count) break;
      const id = uuidv4();
      const externalId = `${brandName.toLowerCase().replace(/\s/g, '-')}-${String(counter + 1).padStart(4, '0')}`;
      const discountPct = Math.round((1 - product.sale_price / product.original_price) * 100);

      const stockOptions: Array<'in_stock' | 'low_stock' | 'out_of_stock'> = [
        'in_stock', 'in_stock', 'in_stock', 'in_stock', 'in_stock',
        'in_stock', 'low_stock', 'low_stock', 'out_of_stock'
      ];
      const stockLevel = randomItem(stockOptions);

      const ageHours = randomInt(0, 336); // Last 2 weeks
      const createdAt = new Date(Date.now() - ageHours * 3600 * 1000);

      products.push({
        id,
        external_id: externalId,
        brand: brandName,
        name: product.name,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        sizes_available: product.sizes,
        image_urls: [
          `https://picsum.photos/seed/${product.imageId}/400/600`,
          `https://picsum.photos/seed/${product.imageId}-alt/400/600`,
        ],
        original_price: product.original_price,
        discounted_price: product.sale_price,
        discount_pct: discountPct,
        affiliate_url: buildAffiliateUrl(brandName, product.slug, brand.affiliateId, brand.domain),
        source: 'shareasale', // simulating real source
        stock_level: stockLevel,
        is_active: stockLevel !== 'out_of_stock',
        created_at: createdAt,
      });
      counter++;
    }
  }

  // Second pass: fill remaining slots with realistic variations
  const EXTRA_PRODUCTS = [
    { brand: 'ASOS', name: 'ASOS DESIGN Barrel Leg Jeans', category: 'bottoms', subcategory: 'jeans', original: 55.00, sale: 22.00, sizes: ['6','8','10','12','14'], imageId: 'asos-barrel-jeans' },
    { brand: 'Zara', name: 'Linen Blend Wide Leg Trousers', category: 'bottoms', subcategory: 'trousers', original: 69.90, sale: 27.99, sizes: ['XS','S','M','L','XL'], imageId: 'zara-linen-trousers' },
    { brand: 'Nike', name: 'Nike Club Fleece Joggers', category: 'bottoms', subcategory: 'leggings', original: 60.00, sale: 34.99, sizes: ['XS','S','M','L','XL','XXL'], imageId: 'nike-joggers' },
    { brand: 'Adidas', name: 'Adidas Gazelle Indoor Shoes', category: 'shoes', subcategory: 'sneakers', original: 110.00, sale: 69.99, sizes: ['5','6','7','8','9','10'], imageId: 'adidas-gazelle' },
    { brand: 'Mango', name: 'Asymmetric Hem Mini Dress', category: 'dresses', subcategory: 'mini dress', original: 59.99, sale: 29.99, sizes: ['XS','S','M','L'], imageId: 'mango-mini-dress' },
    { brand: 'Revolve', name: 'Show Me Your Mumu Wrap Dress', category: 'dresses', subcategory: 'wrap dress', original: 148.00, sale: 59.00, sizes: ['XS','S','M','L'], imageId: 'revolve-wrap-dress' },
    { brand: 'Free People', name: 'Easy Street Barrel Jeans', category: 'bottoms', subcategory: 'jeans', original: 98.00, sale: 49.00, sizes: ['24','25','26','27','28','29','30'], imageId: 'fp-barrel-jeans' },
    { brand: 'Urban Outfitters', name: 'Silence + Noise Varsity Jacket', category: 'tops', subcategory: 'jacket', original: 99.00, sale: 44.99, sizes: ['XS','S','M','L','XL'], imageId: 'uo-varsity' },
    { brand: 'ASOS', name: 'ASOS DESIGN Cord Mini Skirt', category: 'bottoms', subcategory: 'skirt', original: 38.00, sale: 15.00, sizes: ['6','8','10','12','14','16'], imageId: 'asos-cord-skirt' },
    { brand: 'Zara', name: 'Ribbed Knit Cardigan', category: 'tops', subcategory: 'sweater', original: 49.90, sale: 24.99, sizes: ['XS','S','M','L','XL'], imageId: 'zara-cardigan' },
    { brand: 'Nike', name: 'Nike Court Vision Low', category: 'shoes', subcategory: 'sneakers', original: 80.00, sale: 49.99, sizes: ['6','7','8','9','10','11'], imageId: 'nike-court-vision' },
    { brand: 'Adidas', name: 'Adidas Trefoil Hoodie', category: 'tops', subcategory: 'hoodie', original: 70.00, sale: 38.99, sizes: ['XS','S','M','L','XL','XXL'], imageId: 'adidas-trefoil-hoodie' },
    { brand: 'Mango', name: 'Strappy Heeled Sandals', category: 'shoes', subcategory: 'heels', original: 79.99, sale: 34.99, sizes: ['36','37','38','39','40','41'], imageId: 'mango-sandals' },
    { brand: 'ASOS', name: 'ASOS DESIGN Corset Top', category: 'tops', subcategory: 'blouse', original: 32.00, sale: 12.00, sizes: ['XS','S','M','L','XL'], imageId: 'asos-corset' },
    { brand: 'Free People', name: 'Movement Barely There Longline Bra', category: 'tops', subcategory: 'crop top', original: 58.00, sale: 25.00, sizes: ['XS','S','M','L','XL'], imageId: 'fp-bra' },
    { brand: 'Urban Outfitters', name: 'Levi\'s 501 Original Jeans', category: 'bottoms', subcategory: 'jeans', original: 98.00, sale: 54.99, sizes: ['24','25','26','27','28','29','30','31','32'], imageId: 'levis-501' },
    { brand: 'Revolve', name: 'PISTOLA Audrey High Rise Crop Flare', category: 'bottoms', subcategory: 'jeans', original: 178.00, sale: 79.00, sizes: ['24','25','26','27','28','29'], imageId: 'revolve-flare' },
    { brand: 'Zara', name: 'Satin Effect Maxi Skirt', category: 'bottoms', subcategory: 'skirt', original: 59.90, sale: 25.99, sizes: ['XS','S','M','L','XL'], imageId: 'zara-satin-skirt' },
    { brand: 'Nike', name: 'Nike Everyday Cushioned Crew Socks', category: 'accessories', subcategory: 'accessories', original: 18.00, sale: 9.99, sizes: ['One Size'], imageId: 'nike-socks' },
    { brand: 'ASOS', name: 'ASOS DESIGN Mini Shoulder Bag', category: 'accessories', subcategory: 'bag', original: 28.00, sale: 11.00, sizes: ['One Size'], imageId: 'asos-bag' },
  ];

  while (counter < count) {
    const template = EXTRA_PRODUCTS[counter % EXTRA_PRODUCTS.length];
    const variation = Math.floor(counter / EXTRA_PRODUCTS.length);
    const id = uuidv4();
    const brandKey = template.brand.toLowerCase().replace(/\s/g, '-');
    const externalId = `${brandKey}-extra-${String(counter + 1).padStart(4, '0')}`;
    const discountPct = Math.round((1 - template.sale / template.original) * 100);
    const catalog = BRAND_CATALOG[template.brand];

    const stockOptions: Array<'in_stock' | 'low_stock' | 'out_of_stock'> = [
      'in_stock', 'in_stock', 'in_stock', 'in_stock', 'in_stock',
      'in_stock', 'low_stock', 'low_stock', 'out_of_stock'
    ];
    const stockLevel = randomItem(stockOptions);
    const ageHours = randomInt(0, 504);
    const createdAt = new Date(Date.now() - ageHours * 3600 * 1000);

    products.push({
      id,
      external_id: externalId,
      brand: template.brand,
      name: template.name,
      description: `${template.name} from ${template.brand}. Limited time sale — was $${template.original.toFixed(2)}, now $${template.sale.toFixed(2)}.`,
      category: template.category,
      subcategory: template.subcategory,
      sizes_available: template.sizes,
      image_urls: [
        `https://picsum.photos/seed/${template.imageId}-${variation}/400/600`,
        `https://picsum.photos/seed/${template.imageId}-${variation}-b/400/600`,
      ],
      original_price: template.original,
      discounted_price: template.sale,
      discount_pct: discountPct,
      affiliate_url: catalog
        ? buildAffiliateUrl(template.brand, `product/${externalId}`, catalog.affiliateId, catalog.domain)
        : `https://www.anrdoezrs.net/click-${brandKey}?url=${encodeURIComponent(`https://www.${brandKey}.com/sale`)}&sid=threaddrop`,
      source: 'cj',
      stock_level: stockLevel,
      is_active: stockLevel !== 'out_of_stock',
      created_at: createdAt,
    });
    counter++;
  }

  return products;
}

export function generateProductStats(productIds: string[]) {
  return productIds.map((productId) => {
    const viewCount = randomInt(200, 80000);
    const saveCount = Math.floor(viewCount * (Math.random() * 0.15));
    const clickCount = Math.floor(viewCount * (Math.random() * 0.12));
    return { product_id: productId, view_count: viewCount, save_count: saveCount, click_count: clickCount };
  });
}
