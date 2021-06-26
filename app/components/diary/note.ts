import {FastifyInstance} from 'fastify';
import {INote} from '@/components/diary/types';
import {checkToken} from '@/hooks';
import {checkANDPrepareNote} from '@/components/diary/assistant';
import {noteSyncSchemePost} from '@/components/diary/note.scheme';

type ChangesByEvents = {
  created: INote[],
  updated: INote[],
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
  diaryId: number
  lastPulledAt: number | null
  schemaVersion: number
  migration: null | { from: number, tables: string[], columns: { table: string, columns: string[] }[] }
}
interface IQuerystringPush {
  diaryId: number
  lastPulledAt: number
}
interface IBodyPush {
  changes: Changes
}
const tableName = 'notes';
enum Events {
  created='created',
  updated = 'updated',
  deleted = 'deleted'
}
export const note = async (server: FastifyInstance) => {
  server.get<{Querystring: IQuerystringPull, Headers: IHeaders}>(
    '/note/sync',
    {preValidation: checkToken},
    async (req, reply) => {
      let {lastPulledAt, diaryId} = req.query;
      lastPulledAt === undefined && (lastPulledAt = null);
      diaryId = Number(diaryId);

      await server.pg.query('BEGIN');
      const {rows: created} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_created_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at = server_updated_at AND server_deleted_at is NULL AND diary_id = $2 FOR UPDATE', [lastPulledAt, diaryId]);
      const {rows: updated} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_updated_at >= to_timestamp($1 / 1000.0) OR $1 IS NULL) AND server_created_at != server_updated_at AND server_deleted_at is NULL AND diary_id = $2 FOR UPDATE', [lastPulledAt, diaryId]);
      const {rows: deleted} = await server.pg.query<INote>('SELECT * FROM root.notes WHERE (server_deleted_at >= to_timestamp($1 / 1000.0) OR server_deleted_at IS NOT NULL AND $1 IS NULL) AND diary_id = $2 FOR UPDATE', [lastPulledAt, diaryId]);
      await server.pg.query('COMMIT');
      const deletedIds = deleted.map(note => note.id);
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
    '/note/sync',
    {schema: noteSyncSchemePost, preValidation: checkToken},
    async (req, reply) => {
      const {lastPulledAt, diaryId} = req.query;
      const {changes} = req.body;
      const changesByEvents: ChangesByEvents = changes[tableName];

      try {
        if (changesByEvents) {
          //created and updated
          const notes = [...changesByEvents[Events.created], ...changesByEvents[Events.updated]];

          await server.pg.query('BEGIN');
          let processedNotes = 0;
          for (const note of notes) {
            const _ = checkANDPrepareNote(note);
            const {rows} = await server.pg.query(`SELECT id, server_deleted_at, server_updated_at FROM root.notes WHERE id=$1`, [_.id]);
            const currNote = rows[0];
            //if changed between user's pull and push calls
            if (currNote) {
              const serverUpdatedAt = new Date(currNote.server_updated_at).getTime();
              const serverDeletedAt = new Date(currNote.server_deleted_at).getTime();
              if (serverDeletedAt > lastPulledAt || serverUpdatedAt > lastPulledAt) {
                throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR');
              }
            }


            if (currNote?.server_deleted_at === null || !currNote) {
              const {rowCount} = await server.pg.query<INote>(
                `INSERT INTO root.notes
                 VALUES ($1, $2, now(), now(), null, to_timestamp($3 / 1000.0),
                         to_timestamp($4 / 1000.0), $5,
                         $6, $7, $8, $9, $10, $11, $12,
                         $13, $14, $15, $16, $17, $18, $19,
                         $20, $21, $22)
                 ON CONFLICT (id) DO UPDATE SET diary_id          = $2,
                                                server_created_at = now(),
                                                server_updated_at = now(),
                                                server_deleted_at = null,
                                                created_at        = to_timestamp($3 / 1000.0),
                                                updated_at        = to_timestamp($4 / 1000.0),
                                                note_type         = $5,
                                                date_event_start  = now(),
                                                date_event_end    = now(),
                                                photo             = $8,
                                                food              = $9,
                                                volume            = $10,
                                                note              = $11,
                                                duration          = $12,
                                                milk_volume_left  = $13,
                                                milk_volume_right = $14,
                                                type              = $15,
                                                achievement       = $16,
                                                weight            = $17,
                                                growth            = $18,
                                                head_circle       = $19,
                                                temp              = $20,
                                                tags              = $21,
                                                pressure          = $22;`,
                [
                  _.id, _.diaryId, _.createdAt, _.updatedAt, _.noteType,
                  _.dateEventStart, _.dateEventEnd, _.photo, _.food,
                  _.volume, _.note, _.duration, _.milkVolumeRight,
                  _.milkVolumeLeft, _.type, _.achievement, _.weight,
                  _.growth, _.headCircle, _.temp, _.tags, _.pressure
                ]
              );

              if (rowCount) {
                processedNotes++;
              } else {
                throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${_.id}`);
              }
            } else {
              throw new Error(`The changes object contains a record with id=${currNote.id} that was deleted`);
            }
          }

          //deleted
          let processedDeletes = 0;
          for (const idDeleted of changesByEvents[Events.deleted]) {
            const {rowCount: deleted} = await server.pg.query<INote>(`UPDATE root.notes SET server_deleted_at=now() WHERE id = $1`, [idDeleted]);
            deleted && processedDeletes++;
          }

          if (processedNotes === notes.length && processedDeletes <= changesByEvents[Events.deleted].length) {
            await server.pg.query('COMMIT');
            return reply.send();
          } else {
            throw new Error();
          }
        }
      } catch (e) {
        await server.pg.query('ROLLBACK');
        return reply.status(500).send(e);
      }
    });
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
