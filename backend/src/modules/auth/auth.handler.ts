import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { query } from '../../db/index';
import { User } from '../../types/models';
import { config } from '../../config';

const SALT_ROUNDS = 12;

function generateTokens(fastify: any, userId: string, email: string) {
  const accessToken = fastify.jwt.sign(
    { sub: userId, email, type: 'access' },
    { expiresIn: config.JWT_ACCESS_EXPIRES }
  );
  const refreshToken = fastify.jwt.sign(
    { sub: userId, email, type: 'refresh' },
    { expiresIn: config.JWT_REFRESH_EXPIRES }
  );
  return { accessToken, refreshToken };
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { email, password, display_name } = request.body as {
    email: string;
    password: string;
    display_name?: string;
  };

  const existing = await query<User>('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    return reply.status(409).send({ error: 'Email already registered' });
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await query<User>(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, onboarded, created_at`,
    [email, password_hash, display_name || null]
  );

  const user = rows[0];
  const tokens = generateTokens(request.server, user.id, user.email);

  return reply.status(201).send({
    user: { id: user.id, email: user.email, display_name: user.display_name, onboarded: user.onboarded },
    ...tokens,
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };

  const { rows } = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (rows.length === 0) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const tokens = generateTokens(request.server, user.id, user.email);

  return reply.send({
    user: { id: user.id, email: user.email, display_name: user.display_name, onboarded: user.onboarded },
    ...tokens,
  });
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const { refresh_token } = request.body as { refresh_token: string };

  try {
    const payload = request.server.jwt.verify<{ sub: string; email: string; type: string }>(refresh_token);
    if (payload.type !== 'refresh') {
      return reply.status(401).send({ error: 'Invalid token type' });
    }

    const tokens = generateTokens(request.server, payload.sub, payload.email);
    return reply.send(tokens);
  } catch {
    return reply.status(401).send({ error: 'Invalid or expired refresh token' });
  }
}

export async function logout(_request: FastifyRequest, reply: FastifyReply) {
  // For MVP, client-side token removal is sufficient
  // In production, maintain a token blocklist in Redis
  return reply.send({ message: 'Logged out' });
}
