import { FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../../db/index';

const ALL_SIZES = {
  standard: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes_us: ['5', '6', '7', '8', '9', '10', '11'],
  shoes_eu: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
};

const ALL_BRANDS = [
  'Zara', 'H&M', 'ASOS', 'Nike', 'Adidas', 'Levis',
  'Mango', 'Free People', 'Urban Outfitters', 'Revolve',
  'PrettyLittleThing', 'Missguided', 'Other Stories', 'Topshop', 'Reformation'
];

const ALL_CATEGORIES = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
];

export async function getOptions(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    sizes: ALL_SIZES,
    brands: ALL_BRANDS,
    categories: ALL_CATEGORIES,
  });
}

export async function completeOnboarding(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { sizes, brands, categories } = request.body as {
    sizes: string[];
    brands?: string[];
    categories?: string[];
  };

  await query(
    `INSERT INTO user_preferences (user_id, sizes, brands, categories)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) DO UPDATE
     SET sizes = $2, brands = $3, categories = $4, updated_at = NOW()`,
    [userId, sizes, brands || [], categories || []]
  );

  await query(
    'UPDATE users SET onboarded = TRUE, updated_at = NOW() WHERE id = $1',
    [userId]
  );

  return reply.send({ message: 'Onboarding complete' });
}

export async function updatePreferences(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { sizes, brands, categories } = request.body as {
    sizes?: string[];
    brands?: string[];
    categories?: string[];
  };

  await query(
    `INSERT INTO user_preferences (user_id, sizes, brands, categories)
     VALUES ($1, COALESCE($2, '{}'), COALESCE($3, '{}'), COALESCE($4, '{}'))
     ON CONFLICT (user_id) DO UPDATE
     SET sizes = COALESCE($2, user_preferences.sizes),
         brands = COALESCE($3, user_preferences.brands),
         categories = COALESCE($4, user_preferences.categories),
         updated_at = NOW()`,
    [userId, sizes || null, brands || null, categories || null]
  );

  return reply.send({ message: 'Preferences updated' });
}
