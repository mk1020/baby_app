import {FastifyInstance} from 'fastify';
import {IChapter, IPhotoByMonth} from '@/components/diary/types';
import {checkToken} from '@/hooks';
import {createOrUpdatePhoto, preparePhoto} from '@/components/diary/assistant';

type ChangesByEvents = {
  created: IPhotoByMonth[],
  updated: IPhotoByMonth[],
  deleted: string[],
}
type Changes = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEvents
}

interface IHeaders {
  userId: number
  token: string
}
interface IQuerystringPull {
  userId: number
  lastPulledAt: number | null
  schemaVersion: number
  migration: null | { from: number, tables: string[], columns: { table: string, columns: string[] }[] }
}
interface IQuerystringPush {
  userId: number
  lastPulledAt: number
}
interface IBodyPush {
  changes: Changes
}
const tableName = 'photos_by_month';
enum Events {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}
export const photosByMonth = async (server: FastifyInstance) => {
  server.get<{Querystring: IQuerystringPull, Headers: IHeaders}>(
    '/photos-by-month/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      let {lastPulledAt, userId} = req.query;
      lastPulledAt === undefined && (lastPulledAt = null);
      userId = Number(userId);

      await server.pg.query('BEGIN');
      const {rows: created} = await server.pg.query<IPhotoByMonth>('SELECT * FROM root.photos_by_month WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updated} = await server.pg.query<IPhotoByMonth>('SELECT * FROM root.photos_by_month WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: deleted} = await server.pg.query<IPhotoByMonth>('SELECT * FROM root.photos_by_month WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      await server.pg.query('COMMIT');
      const deletedIds = deleted.map(photo => photo.id);
      const changes: Changes = {
        [tableName]: {
          created,
          updated,
          deleted: deletedIds
        }
      };
      return reply.send({changes, timestamp: new Date().getTime()});
    });

  server.post<{Querystring: IQuerystringPush, Headers: IHeaders, Body: IBodyPush}>(
    '/photos-by-month/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      const {lastPulledAt} = req.query;
      const {changes} = req.body;
      const {userId} = req.headers;

      const changesByEvents: ChangesByEvents = changes[tableName];
      try {
        if (changesByEvents) {
          //created and updated
          const photos = [...changesByEvents[Events.created], ...changesByEvents[Events.updated]];

          await server.pg.query('BEGIN');
          const {rows: diary} = await server.pg.query(`SELECT id FROM root.diaries WHERE user_id=$1`, [userId]);
          if (diary.length) {
            const diaryId = diary[0].id;

            let processedPhotos = 0;
            for (const photo of photos) {
              const preparedPhoto = preparePhoto(photo);

              const {rows} = await server.pg.query(`SELECT id, server_deleted_at, server_updated_at FROM root.photos_by_month WHERE id=$1`, [preparedPhoto.id]);
              const currPhoto = rows.length && rows[0];

              if (currPhoto) {
                const serverUpdatedAt = new Date(currPhoto.server_updated_at).getTime();

                const serverDeletedAt = new Date(currPhoto.server_deleted_at).getTime();
                //if changed between user's pull and push calls
                if (serverDeletedAt > lastPulledAt || serverUpdatedAt > lastPulledAt) {
                  throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR');
                }
              }

              if (currPhoto?.server_deleted_at === null || !currPhoto) {
                const {rowCount} = await createOrUpdatePhoto(preparedPhoto, server, diaryId);

                if (rowCount) {
                  processedPhotos++;
                } else {
                  throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedPhoto.id}`);
                }
              } else {
                throw new Error(`The changes object contains a record with id=${currPhoto.id} that was deleted`);
              }
            }

            //deleted
            let processedDeletes = 0;
            for (const idDeleted of changesByEvents[Events.deleted]) {
              const {rowCount: deleted} = await server.pg.query<IChapter>(`UPDATE root.photos_by_month SET server_deleted_at=now() WHERE id = $1`, [idDeleted]);
              deleted && processedDeletes++;
            }

            if (processedPhotos === photos.length && processedDeletes <= changesByEvents[Events.deleted].length) {
              await server.pg.query('COMMIT');
              reply.send();
            } else {
              throw new Error('error');
            }
          } else {
            reply.status(500).send(new Error(`the diary does not exist for the user`));
          }
        } else {
          reply.status(500).send(new Error(`something wrong with changes[${tableName}]`));
        }
      } catch (e) {
        await server.pg.query('ROLLBACK');
        reply.status(500).send(e);
      }
    });
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
