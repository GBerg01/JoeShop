import { FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../../db/index';
import { User, UserPreferences } from '../../types/models';

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;

  const { rows: users } = await query<User>(
    'SELECT id, email, display_name, avatar_url, onboarded, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (users.length === 0) {
    return reply.status(404).send({ error: 'User not found' });
  }

  const { rows: prefs } = await query<UserPreferences>(
    'SELECT * FROM user_preferences WHERE user_id = $1',
    [userId]
  );

  return reply.send({ ...users[0], preferences: prefs[0] || null });
}

export async function updateMe(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { display_name, avatar_url } = request.body as {
    display_name?: string;
    avatar_url?: string;
  };

  const { rows } = await query<User>(
    `UPDATE users
     SET display_name = COALESCE($1, display_name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, email, display_name, avatar_url, onboarded`,
    [display_name || null, avatar_url || null, userId]
  );

  return reply.send(rows[0]);
}
