import {INote, INoteEditable, TNoteType} from '@/components/diary/types';

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

//todo что возвращает? тип..
export const checkANDPrepareNote = (note: INote) => {
  /*if (!note.id || !note.diary_id || !note.note_type) {
    throw new Error('id or diaryId or noteType was not passed');
  }*/
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


