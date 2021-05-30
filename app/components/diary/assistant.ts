import {INote, INoteEditable, TNoteType} from '@/components/diary/types';

type TFieldsNoteByType = {
  [K in TNoteType]: (keyof INote)[]
}
export const fieldsNoteByType: TFieldsNoteByType = {
  1: ['id', 'diaryId', 'editDate', 'noteType', 'dateEventStart', 'dateEventEnd', 'photo', 'food', 'note'],
  2: ['id', 'diaryId', 'editDate', 'noteType', 'dateEventStart', 'dateEventEnd', 'photo', 'duration', 'note'],
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
};

const allFields = ([] as string[]).concat(...Object.values(fieldsNoteByType));
export const allFieldNote = new Set(allFields);

export const queryByNoteField: INoteEditable<string> = {
  note: `UPDATE root.diary_note SET note=$2, edit_date = jsonb_set(edit_date, '{note}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4 AND ((edit_date::jsonb->>'note')::timestamptz) < ($1::timestamptz)`,
  noteType: `UPDATE root.diary_note SET note_type=$2, edit_date = jsonb_set(edit_date, '{noteType}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'noteType')::timestamptz) < ($1::timestamptz)`,
  dateEventStart: `UPDATE root.diary_note SET date_event_start=$2, edit_date = jsonb_set(edit_date, '{dateEventStart}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'dateEventStart')::timestamptz) < ($1::timestamptz)`,
  dateEventEnd: `UPDATE root.diary_note SET date_event_end=$2, edit_date = jsonb_set(edit_date, '{dateEventEnd}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'dateEventEnd')::timestamptz) < ($1::timestamptz)`,
  photo: `UPDATE root.diary_note SET photo=$2, edit_date = jsonb_set(edit_date, '{photo}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'photo')::timestamptz) < ($1::timestamptz)`,
  duration: `UPDATE root.diary_note SET duration=$2, edit_date = jsonb_set(edit_date, '{duration}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'duration')::timestamptz) < ($1::timestamptz)`,
  milkVolumeLeft: `UPDATE root.diary_note SET milk_volume_left=$2, edit_date = jsonb_set(edit_date, '{milkVolumeLeft}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'milkVolumeLeft')::timestamptz) < ($1::timestamptz)`,
  milkVolumeRight: `UPDATE root.diary_note SET milk_volume_right=$2, edit_date = jsonb_set(edit_date, '{milkVolumeRight}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'milkVolumeRight')::timestamptz) < ($1::timestamptz)`,
  type: `UPDATE root.diary_note SET type=$2, edit_date = jsonb_set(edit_date, '{type}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'type')::timestamptz) < ($1::timestamptz)`,
  achievement: `UPDATE root.diary_note SET achievement=$2, edit_date = jsonb_set(edit_date, '{achievement}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'achievement')::timestamptz) < ($1::timestamptz)`,
  weight: `UPDATE root.diary_note SET weight=$2, edit_date = jsonb_set(edit_date, '{weight}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'weight')::timestamptz) < ($1::timestamptz)`,
  growth: `UPDATE root.diary_note SET growth=$2, edit_date = jsonb_set(edit_date, '{growth}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'growth')::timestamptz) < ($1::timestamptz)`,
  headCircle: `UPDATE root.diary_note SET head_circle=$2, edit_date = jsonb_set(edit_date, '{headCircle}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'headCircle')::timestamptz) < ($1::timestamptz)`,
  temp: `UPDATE root.diary_note SET temp=$2, edit_date = jsonb_set(edit_date, '{temp}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'temp')::timestamptz) < ($1::timestamptz)`,
  tags: `UPDATE root.diary_note SET tags=$2, edit_date = jsonb_set(edit_date, '{tags}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'tags')::timestamptz) < ($1::timestamptz)`,
  pressure: `UPDATE root.diary_note SET pressure=$2, edit_date = jsonb_set(edit_date, '{pressure}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'pressure')::timestamptz) < ($1::timestamptz)`,
  volume: `UPDATE root.diary_note SET volume=$2, edit_date = jsonb_set(edit_date, '{volume}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'volume')::timestamptz) < ($1::timestamptz)`,
  food: `UPDATE root.diary_note SET food=$2, edit_date = jsonb_set(edit_date, '{food}', to_jsonb($1)) WHERE id = $3 AND diary_id = $4  AND ((edit_date::jsonb->>'food')::timestamptz) < ($1::timestamptz)`,
};
