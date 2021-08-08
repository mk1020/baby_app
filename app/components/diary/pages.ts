import {FastifyInstance} from 'fastify';
import {INote, IPage} from '@/components/diary/types';
import {checkToken} from '@/hooks';
import {createOrUpdateNote, createOrUpdatePage, prepareNote, preparePage} from '@/components/diary/assistant';
import {noteSyncSchemePost} from '@/components/diary/note.scheme';

type ChangesByEvents = {
  created: IPage[],
  updated: IPage[],
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
const tableName = 'pages';
enum Events {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}
export const pages = async (server: FastifyInstance) => {
  server.get<{Querystring: IQuerystringPull, Headers: IHeaders}>(
    '/pages/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      let {lastPulledAt, userId} = req.query;
      lastPulledAt === undefined && (lastPulledAt = null);
      userId = Number(userId);
      console.log('lastPulledAt', lastPulledAt);
      await server.pg.query('BEGIN');
      const {rows: created} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updated} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: deleted} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      await server.pg.query('COMMIT');
      const deletedIds = deleted.map(page => page.id);
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
    '/pages/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      const {lastPulledAt} = req.query;
      const {userId} = req.headers;
      const {changes} = req.body;
      const changesByEvents: ChangesByEvents = changes[tableName];

      try {
        if (changesByEvents) {
          //created and updated
          const pages = [...changesByEvents[Events.created], ...changesByEvents[Events.updated]];
          await server.pg.query('BEGIN');
          const {rows: diary} = await server.pg.query(`SELECT id FROM root.diaries WHERE user_id=$1`, [userId]);
          if (diary.length) {
            const diaryId = diary[0].id;

            let processedPages = 0;
            for (const page of pages) {
              const preparedPage = preparePage(page);
              const {rows} = await server.pg.query(`SELECT id, server_deleted_at, server_updated_at
                                                     FROM root.pages
                                                     WHERE id = $1`, [preparedPage.id]);
              const currPage = rows.length && rows[0];
              if (currPage) {
                const serverUpdatedAt = new Date(currPage.server_updated_at).getTime();
                const serverDeletedAt = new Date(currPage.server_deleted_at).getTime();
                //if changed between user's pull and push calls
                if (serverDeletedAt > lastPulledAt || serverUpdatedAt > lastPulledAt) {
                  throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR');
                }
              }

              if (currPage?.server_deleted_at === null || !currPage) {
                const {rowCount} = await createOrUpdatePage(preparedPage, server, diaryId);

                if (rowCount) {
                  processedPages++;
                } else {
                  throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedPage.id}`);
                }
              } else {
                throw new Error(`The changes object contains a record with id=${currPage.id} that was deleted`);
              }
            }

            //deleted
            let processedDeletes = 0;
            for (const idDeleted of changesByEvents[Events.deleted]) {
              const {rowCount: deleted} = await server.pg.query<IPage>(`UPDATE root.pages
                                                                         SET server_deleted_at=now()
                                                                         WHERE id = $1`, [idDeleted]);
              const {rowCount: deletedNotes} = await server.pg.query<INote>(`UPDATE root.notes
                                                                              SET server_deleted_at=now()
                                                                              WHERE page_id = $1`, [idDeleted]);
              deleted && processedDeletes++;
            }

            if (processedPages === pages.length && processedDeletes <= changesByEvents[Events.deleted].length) {
              await server.pg.query('COMMIT');
              reply.send();
            } else {
              throw new Error();
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
