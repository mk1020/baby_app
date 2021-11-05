import {FastifyInstance} from 'fastify';
import {INote} from '@/components/diary/types';
import {createOrUpdateNote, prepareNote} from '@/components/diary/assistant';
import {NotesTableName} from '@/components/diary/sync';
import {throws} from 'assert';

type ChangesByEvents = {
  created: any[],
  updated: any[],
  deleted: string[],
}
type Changes = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEvents
}

enum Events {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}

export const notes = async (
  server: FastifyInstance,
  lastPulledAt: number,
  userId: number,
  changes: Changes
) => {
  const changesByEvents: ChangesByEvents = changes[NotesTableName];

  try {
    if (changesByEvents) {
      //created and updated
      const notes = [...changesByEvents[Events.created], ...changesByEvents[Events.updated]];

      await server.pg.query('BEGIN');
      const {rows: diary} = await server.pg.query(`SELECT id FROM root.diaries WHERE user_id=$1`, [userId]);
      if (diary.length) {
        const diaryId = diary[0].id;

        let processedNotes = 0;
        for (const note of notes) {
          const preparedNote = prepareNote(note);
          const {rows} = await server.pg.query(`SELECT id, server_deleted_at, server_updated_at FROM root.notes WHERE id=$1`, [preparedNote.id]);
          const currNote = rows.length && rows[0];
          if (currNote) {
            const serverUpdatedAt = new Date(currNote.server_updated_at).getTime();
            const serverDeletedAt = new Date(currNote.server_deleted_at).getTime();
            //if changed between user's pull and push calls
            if (serverDeletedAt > lastPulledAt || serverUpdatedAt > lastPulledAt) {
              throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR in ' + NotesTableName);
            }
          }

          if (currNote?.server_deleted_at === null || !currNote) {
            const {rowCount} = await createOrUpdateNote(preparedNote, server, diaryId);

            if (rowCount) {
              processedNotes++;
            } else {
              throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedNote.id} in ` + NotesTableName);
            }
          } else {
            throw new Error(`The changes object contains a record with id=${currNote.id} that was deleted in ` + NotesTableName);
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
          return true;
        } else {
          throw new Error();
        }
      } else {
        throw new Error(`the diary does not exist for the user in ` + NotesTableName);
      }
    } else {
      throw new Error(`something wrong with changes[${NotesTableName}]`);
    }
  } catch (e) {
    await server.pg.query('ROLLBACK');
    throw new Error('err status 500 in ' + NotesTableName);
  }
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
