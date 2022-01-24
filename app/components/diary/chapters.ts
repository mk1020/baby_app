import {FastifyInstance} from 'fastify';
import {IChapter, INote, IPage} from '@/components/diary/types';
import {createOrUpdateChapter, prepareChapter} from '@/components/diary/assistant';
import {ChaptersTableName} from '@/components/diary/sync';

type ChangesByEvents = {
  created: IChapter[],
  updated: IChapter[],
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
export const chapters = async (
  server: FastifyInstance,
  lastPulledAt: number,
  userId: number,
  changes: Changes
) => {
  const changesByEvents: ChangesByEvents = changes[ChaptersTableName];

  try {
    if (changesByEvents) {
      //created and updated
      const chapters = [...changesByEvents[Events.created], ...changesByEvents[Events.updated]];

      await server.pg.query('BEGIN');
      const {rows: diary} = await server.pg.query(`SELECT id FROM root.diaries WHERE user_id=$1`, [userId]);
      if (diary.length) {
        const diaryId = diary[0].id;

        let processedChapters = 0;
        for (const chapter of chapters) {
          const preparedChapter = prepareChapter(chapter);

          const {rows} = await server.pg.query(`SELECT id, server_deleted_at, server_updated_at FROM root.chapters WHERE id=$1`, [preparedChapter.id]);
          const currChapter = rows.length && rows[0];

          if (currChapter) {
            const serverUpdatedAt = new Date(currChapter.server_updated_at).getTime();

            const serverDeletedAt = new Date(currChapter.server_deleted_at).getTime();
            //if changed between user's pull and push calls
            if (serverDeletedAt > lastPulledAt || serverUpdatedAt > lastPulledAt) {
              throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR in ' + ChaptersTableName);
            }
          }

          if (currChapter?.server_deleted_at === null || !currChapter) {
            const {rowCount} = await createOrUpdateChapter(preparedChapter, server, diaryId);

            if (rowCount) {
              processedChapters++;
            } else {
              throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedChapter.id} in` + ChaptersTableName);
            }
          } else {
            throw new Error(`The changes object contains a record with id=${currChapter.id} that was deleted in ` + ChaptersTableName);
          }
        }

        //deleted
        let processedDeletes = 0;
        for (const idDeleted of changesByEvents[Events.deleted]) {
          const {rowCount: deleted} = await server.pg.query<IChapter>(`UPDATE root.chapters SET server_deleted_at=now() WHERE id = $1`, [idDeleted]);
          const {rowCount: deletedPages} = await server.pg.query<IPage>(`UPDATE root.pages SET server_deleted_at=now() WHERE chapter_id = $1`, [idDeleted]);
          const {rowCount: deletedNotes} = await server.pg.query<INote>(`UPDATE root.notes SET server_deleted_at=now() WHERE chapter_id = $1`, [idDeleted]);
          deleted && processedDeletes++;
        }

        if (processedChapters === chapters.length && processedDeletes <= changesByEvents[Events.deleted].length) {
          await server.pg.query('COMMIT');
          return true;
        } else {
          throw new Error('error');
        }
      } else {
        throw new Error(`the diary does not exist for the user in ` + ChaptersTableName);
      }
    } else {
      throw new Error(`something wrong with changes[${ChaptersTableName}]`);
    }
  } catch (e) {
    await server.pg.query('ROLLBACK');
    throw new Error('err 500 in ' + ChaptersTableName + e);
  }
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
