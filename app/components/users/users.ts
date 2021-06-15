import {FastifyInstance} from 'fastify'
import {schemePatch} from './routeSchemes'
import {checkToken} from '@/hooks'

interface IBodyPatch {
  dateEnd?: number,
  gestationalAge?: {week: number, day: number},
  conceptionDate?: number,
  lastMenstruationDate?: number,
  cycleDuration?: number,
  userId: number,
  deletePregnant: boolean
}

export const users = async (server: FastifyInstance) => {
  server.patch<{ Body: IBodyPatch }>(
    '/users',
    {schema: schemePatch, preValidation: checkToken},
    async (req, reply) => {
      const {conceptionDate, dateEnd, gestationalAge, lastMenstruationDate, userId, cycleDuration, deletePregnant} = req.body;

      if (conceptionDate) {
        await server.pg.query(`UPDATE root.users SET pregnant_date_start = to_timestamp($1 / 1000.0), pregnant_date_end = to_timestamp($1 / 1000.0) + INTERVAL '266 days' WHERE users.id = $2`, [conceptionDate, userId]);
        return reply.send();
      }

      if (lastMenstruationDate && cycleDuration) {
        const pregnantDateEnd = new Date(lastMenstruationDate);
        pregnantDateEnd.setFullYear(pregnantDateEnd.getFullYear() + 1);
        pregnantDateEnd.setMonth(pregnantDateEnd.getMonth() - 3);
        pregnantDateEnd.setDate(pregnantDateEnd.getDate() + 7 + cycleDuration - 28);
        await server.pg.query('BEGIN');
        await server.pg.query(`UPDATE root.users SET pregnant_date_end = $1 WHERE id = $2`, [pregnantDateEnd.toISOString(), userId]);
        await server.pg.query(`UPDATE root.users SET pregnant_date_start = to_timestamp($1 / 1000.0) - INTERVAL '280 days' WHERE id=$2`, [pregnantDateEnd.getTime(), userId]);
        await server.pg.query('COMMIT');
        return reply.send();
      }

      if (dateEnd) {
        await server.pg.query(`UPDATE root.users SET pregnant_date_end = to_timestamp($1 / 1000.0), pregnant_date_start = to_timestamp($1/1000.0) - INTERVAL '280 days' WHERE id=$2`, [dateEnd, userId]);
        return reply.send();
      }

      if (gestationalAge) {
        const gestationalAgeDays = gestationalAge.week * 7 + gestationalAge.day;
        const remainingTime = 40 * 7 - gestationalAgeDays;
        await server.pg.query(`UPDATE root.users SET pregnant_date_start = current_timestamp - INTERVAL '1 day' * $1::integer, pregnant_date_end= current_timestamp + INTERVAL '1 day' * $2::integer WHERE id=$3`, [gestationalAgeDays, remainingTime, userId]);
        return reply.send();
      }

      if (deletePregnant) {
        await server.pg.query(`UPDATE root.users SET pregnant_date_start = null, pregnant_date_end = null WHERE id=$1`, [userId]);
        return reply.send();
      }

    }
  );
};
