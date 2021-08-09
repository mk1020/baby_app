import {
  IChapter,
  IChapterJS,
  INote,
  INoteEditable,
  INoteJS,
  IPage,
  IPageJS,
  IPhotoByMonth, IPhotoByMonthJS,
  TNoteType,
} from '@/components/diary/types';
import {FastifyInstance} from 'fastify';
import {QueryResult} from 'pg';

export const prepareNote = (note: INote): INoteJS => {
  return {
    id: note.id,
    userId: note.user_id,
    diaryId: note.diary_id,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
    photo: note.photo || null,
    note: note.note,
    tags: note.tags || null,
    title: note.title,
    bookmarked: note.bookmarked,
    chapterId: note.chapter_id || null,
    pageId: note.page_id
  };
};

export const createOrUpdateNote = async (_: INoteJS, server: FastifyInstance, diaryId: string): Promise<QueryResult> => {
  return await server.pg.query<INote>(
    `INSERT INTO root.notes
                 VALUES ($1, $2, $9, $8, now(), now(), null, to_timestamp($3 / 1000.0),
                         to_timestamp($4 / 1000.0), $11,
                         $10, $5, $6, $7, $12)
                 ON CONFLICT (id) DO UPDATE SET diary_id          = $2,
                                                server_created_at = now(),
                                                server_updated_at = now(),
                                                server_deleted_at = null,
                                                created_at        = to_timestamp($3 / 1000.0),
                                                updated_at        = to_timestamp($4 / 1000.0),
                                                photo             = $5,
                                                note              = $6,
                                                tags              = $7,
                                                page_id           = $8,
                                                chapter_id        = $9,
                                                bookmarked        = $10,
                                                title             = $11,
                                                user_id           = $12

;`,
    [
      _.id, diaryId, _.createdAt, _.updatedAt, _.photo,
      _.note, _.tags, _.pageId, _.chapterId, _.bookmarked, _.title, _.userId
    ]
  );
};

export const preparePage = (page: IPage): IPageJS => ({
  id: page.id,
  userId: page.user_id,
  diaryId: page?.diary_id,
  chapterId: page?.chapter_id || null,
  name: page?.name,
  createdAt: page?.created_at,
  updatedAt: page?.updated_at,
});
export const createOrUpdatePage = async (_: IPageJS, server: FastifyInstance, diaryId: string): Promise<QueryResult> => {
  return await server.pg.query<IPage>(
    `INSERT INTO root.pages
     VALUES ($1, $2, $5, $6, now(), now(), null, to_timestamp($3 / 1000.0),
             to_timestamp($4 / 1000.0), $7)
     ON CONFLICT (id) DO UPDATE SET diary_id          = $2,
                                    server_created_at = now(),
                                    server_updated_at = now(),
                                    server_deleted_at = null,
                                    created_at        = to_timestamp($3 / 1000.0),
                                    updated_at        = to_timestamp($4 / 1000.0),
                                    chapter_id        = $5,
                                    user_id           = $7,
                                    name           = $6

    ;`,
    [
      _.id, diaryId, _.createdAt, _.updatedAt,
      _.chapterId, _.name, _.userId
    ]
  );
};


export const prepareChapter = (chapter: IChapter): IChapterJS => ({
  id: chapter.id,
  userId: chapter.user_id,
  diaryId: chapter?.diary_id,
  name: chapter?.name,
  number: chapter?.number,
  createdAt: chapter?.created_at,
  updatedAt: chapter?.updated_at
});
export const createOrUpdateChapter = async (_: IChapterJS, server: FastifyInstance, diaryId: string): Promise<QueryResult> => {
  try {
    return await server.pg.query<IChapter>(
      `INSERT INTO root.chapters
     VALUES ($1, $2, $6, $5, now(), now(), null, to_timestamp($3 / 1000.0),
             to_timestamp($4 / 1000.0), $7)
     ON CONFLICT (id) DO UPDATE SET diary_id          = $2,
                                    server_created_at = now(),
                                    server_updated_at = now(),
                                    server_deleted_at = null,
                                    created_at        = to_timestamp($3 / 1000.0),
                                    updated_at        = to_timestamp($4 / 1000.0),
                                    user_id           = $7,
                                    name           = $6,
                                    number           = $5

    ;`,
      [
        _.id, diaryId, _.createdAt, _.updatedAt,
        _.number, _.name, _.userId
      ]
    );
  } catch (e) {
    throw e;
  }
};

export const preparePhoto = (photo: IPhotoByMonth): IPhotoByMonthJS => ({
  id: photo.id,
  userId: photo.user_id,
  diaryId: photo?.diary_id,
  photo: photo?.photo || null,
  date: photo?.date,
  createdAt: photo?.created_at,
  updatedAt: photo?.updated_at
});

export const createOrUpdatePhoto = async (_: IPhotoByMonthJS, server: FastifyInstance, diaryId: string): Promise<QueryResult> => {
  return await server.pg.query<IPhotoByMonth>(
    `INSERT INTO root.photos_by_month
     VALUES ($1, $7, $2, $5, to_timestamp($6 / 1000.0), now(), now(), null, to_timestamp($3 / 1000.0),
             to_timestamp($4 / 1000.0))
     ON CONFLICT (id) DO UPDATE SET diary_id          = $2,
                                    server_created_at = now(),
                                    server_updated_at = now(),
                                    server_deleted_at = null,
                                    created_at        = to_timestamp($3 / 1000.0),
                                    updated_at        = to_timestamp($4 / 1000.0),
                                    user_id           = $7,
                                    photo           = $5,
                                    date           = to_timestamp($6 / 1000.0)

    ;`,
    [
      _.id, diaryId, _.createdAt, _.updatedAt,
      _.photo, _.date, _.userId
    ]
  );
};
