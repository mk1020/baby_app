import {FastifyInstance} from 'fastify';
import {IChapter, IPhotoByMonth} from '@/components/diary/types';
import {checkToken} from '@/hooks';
import {createOrUpdatePhoto, preparePhoto} from '@/components/diary/assistant';
import {PhotosTableName} from '@/components/diary/sync';

type ChangesByEvents = {
  created: IPhotoByMonth[],
  updated: IPhotoByMonth[],
  deleted?: string[],
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
export const photosByMonth = async (
  server: FastifyInstance,
  lastPulledAt: number,
  userId: number,
  changes: Changes
) => {
  const changesByEvents: ChangesByEvents = changes[PhotosTableName];
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

            //const serverDeletedAt = new Date(currPhoto.server_deleted_at).getTime();
            //if changed between user's pull and push calls
            if (/*serverDeletedAt > lastPulledAt || */serverUpdatedAt > lastPulledAt) {
              throw new Error('DOCUMENT_WAS_MODIFIED_OR_UPDATE_ERROR in ' + PhotosTableName);
            }
          }

          if (currPhoto?.server_deleted_at === null || !currPhoto) {
            const {rowCount} = await createOrUpdatePhoto(preparedPhoto, server, diaryId);

            if (rowCount) {
              processedPhotos++;
            } else {
              throw new Error(`The changes object contains a record that has been modified on the server after lastPulledAt, her id=${preparedPhoto.id} in ` + PhotosTableName);
            }
          } else {
            throw new Error(`The changes object contains a record with id=${currPhoto.id} that was deleted in ` + PhotosTableName);
          }
        }

        //deleted
        //let processedDeletes = 0;
        /*for (const updatedPhoto of changesByEvents[Events.updated]) {
              if (!updatedPhoto.photo) {
                const {rowCount: deleted} = await server.pg.query<IPhotoByMonth>(`UPDATE root.photos_by_month SET server_deleted_at=now() WHERE id = $1`, [updatedPhoto.id]);
                //
                // deleted && processedDeletes++;
              }
            }*/

        if (processedPhotos === photos.length) {
          await server.pg.query('COMMIT');
          return true;
        } else {
          throw new Error('error');
        }
      } else {
        throw new Error(`the diary does not exist for the user in ` + PhotosTableName);
      }
    } else {
      throw new Error(`something wrong with changes[${PhotosTableName}]`);
    }
  } catch (e) {
    await server.pg.query('ROLLBACK');
    throw new Error('err 500 in ' + PhotosTableName);
  }
};
//TODO В частности, убедитесь, что нет записи с last_modified равным или большим чем NOW(), и, если есть, увеличьте новую метку времени на 1....
//https://nozbe.github.io/WatermelonDB/Advanced/Sync.html
//TODO You should perform all queries synchronously or in a write lock to ensure that returned changes are consistent
//todo миграции базы..
