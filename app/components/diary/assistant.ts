import {INote, INoteEditable, TNoteType} from '@/components/diary/types';
import {FastifyInstance} from 'fastify';
import {QueryResult} from 'pg'

type TFieldsNoteByType = {
  [K in TNoteType]: (keyof INote)[]
}
/*export const fieldsNoteByType: TFieldsNoteByType = {
  1: ['id', 'diaryId', /!*'editDate'*!/'noteType', 'dateEventStart', 'dateEventEnd', 'photo', 'food', 'note'],
  2: ['id', 'diaryId'/!*, 'editDate'*!/, 'noteType', 'dateEventStart', 'dateEventEnd', 'photo', 'duration', 'note'],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
};*/

//const allFields = ([] as string[]).concat(...Object.values(fieldsNoteByType));
//export const allFieldNote = new Set(allFields);

export const prepareNote = (note: INote) => {
  return {
    id: note.id,
    diaryId: note.diary_id,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
    noteType: note.note_type,
    dateEventStart: note.date_event_start || null,
    dateEventEnd: note.date_event_end || null,
    photo: note.photo || null,
    food: note.food || null,
    volume: note.volume || null,
    note: note.note || null,
    duration: note.duration || null,
    milkVolumeLeft: note.milk_volume_left || null,
    milkVolumeRight: note.milk_volume_right || null,
    type: note.type || null,
    achievement: note.achievement || null,
    weight: note.weight || null,
    growth: note.growth || null,
    headCircle: note.head_circle || null,
    temp: note.temp || null,
    tags: note.tags || null,
    pressure: note.pressure || null
  };
};

export const createOrUpdateNote = async (_: any, server: FastifyInstance): Promise<QueryResult> => {
  return await server.pg.query<INote>(
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
};

