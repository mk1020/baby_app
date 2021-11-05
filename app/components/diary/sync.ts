import {FastifyInstance} from 'fastify';
import {IChapter, INote, IPage, IPhotoByMonth} from '@/components/diary/types';
import {checkToken} from '@/hooks';
import {createOrUpdateNote, prepareNote} from '@/components/diary/assistant';
import {noteSyncSchemePost} from '@/components/diary/note.scheme';
import {chapters} from '@/components/diary/chapters';
import {pages} from '@/components/diary/pages';
import {notes} from '@/components/diary/notes';
import {photosByMonth} from '@/components/diary/photos_by_month';

type ChangesByEvents = {
  created: any[],
  updated: any[],
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
  changes: Changes,
  lastPulledAt: number
}
enum Events {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}

export const NotesTableName = 'notes';
export const ChaptersTableName = 'chapters';
export const PagesTableName = 'pages';
export const PhotosTableName = 'photos_by_month';

export const sync = async (server: FastifyInstance) => {
  server.get<{Querystring: IQuerystringPull, Headers: IHeaders}>(
    '/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      let {lastPulledAt, userId} = req.query;
      lastPulledAt === undefined && (lastPulledAt = null);
      userId = Number(userId);

      await server.pg.query('BEGIN');
      const {rows: createdNotes} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updatedNotes} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: deletedNotes} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);

      const {rows: createdChapters} = await server.pg.query<IChapter>('SELECT * FROM root.chapters WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updatedChapters} = await server.pg.query<IChapter>('SELECT * FROM root.chapters WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: deletedChapters} = await server.pg.query<IChapter>('SELECT * FROM root.chapters WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);

      const {rows: createdPages} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updatedPages} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: deletedPages} = await server.pg.query<IPage>('SELECT * FROM root.pages WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);

      const {rows: createdPhotosByMonth} = await server.pg.query<IPhotoByMonth>('SELECT * FROM root.photos_by_month WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      const {rows: updatedPhotosByMonth} = await server.pg.query<IPhotoByMonth>('SELECT * FROM root.photos_by_month WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND user_id = $2 FOR UPDATE', [lastPulledAt, userId]);
      await server.pg.query('COMMIT');

      const notesDeletedIds = deletedNotes.map(note => note.id);
      const pagesDeletedIds = deletedPages.map(page => page.id);
      const chaptersDeletedIds = deletedChapters.map(chapter => chapter.id);

      const changes: Changes = {
        [ChaptersTableName]: {
          created: createdChapters,
          updated: updatedChapters,
          deleted: chaptersDeletedIds
        },
        [PagesTableName]: {
          created: createdPages,
          updated: updatedPages,
          deleted: pagesDeletedIds
        },
        [NotesTableName]: {
          created: createdNotes,
          updated: updatedNotes,
          deleted: notesDeletedIds
        },
        [PhotosTableName]: {
          created: createdPhotosByMonth,
          updated: updatedPhotosByMonth,
          deleted: []
        },
      };
      const {rows: diary} = await server.pg.query(`SELECT id FROM root.diaries WHERE user_id=$1`, [userId]);
      const diaryId = diary.length ? diary[0].id : '';

      return reply.send({changes, timestamp: new Date().getTime(), diaryId});
    });

  server.post<{Querystring: IQuerystringPush, Headers: IHeaders, Body: IBodyPush}>(
    '/sync',
    {schema: noteSyncSchemePost, preValidation: checkToken},
    async (req, reply) => {
      const {lastPulledAt, changes} = req.body;
      const {userId} = req.headers;

      console.log('lastPulledAt', lastPulledAt, changes);
      try {
        await chapters(server, lastPulledAt, userId, changes);
        await pages(server, lastPulledAt, userId, changes);
        await notes(server, lastPulledAt, userId, changes);
        await photosByMonth(server, lastPulledAt, userId, changes);

        reply.send();
      } catch (e) {
        reply.status(500).send(e);
      }
    });
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
