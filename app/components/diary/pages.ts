import {FastifyInstance} from 'fastify';
import {INote, IPage} from '@/components/diary/types';
import {createOrUpdatePage, preparePage} from '@/components/diary/assistant';
import {PagesTableName} from '@/components/diary/sync';

type ChangesByEvents = {
  created: IPage[],
  updated: IPage[],
  deleted: string[],
}
type Changes = {
  // eslint-disable-next-line camelcase
  [table_name: string]: ChangesByEvents
}

const tableName = 'pages';
enum Events {
  created = 'created',
  updated = 'updated',
  deleted = 'deleted'
}
export const pages = async (
  server: FastifyInstance,
  lastPulledAt: number,
  userId: number,
  changes: Changes
) => {
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
              throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR in ' + PagesTableName);
            }
          }

          if (currPage?.server_deleted_at === null || !currPage) {
            const {rowCount} = await createOrUpdatePage(preparedPage, server, diaryId);

            if (rowCount) {
              processedPages++;
            } else {
              throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedPage.id} in ` + PagesTableName);
            }
          } else {
            throw new Error(`The changes object contains a record with id=${currPage.id} that was deleted in ` + PagesTableName);
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
          return true;
        } else {
          throw new Error();
        }
      } else {
        throw new Error(`the diary does not exist for the user in ` + PagesTableName);
      }
    } else {
      throw new Error(`something wrong with changes[${PagesTableName}]`);
    }
  } catch (e) {
    await server.pg.query('ROLLBACK');
    throw new Error('err 500 in' + PagesTableName);
  }
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
