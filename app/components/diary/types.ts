export type TNoteType = 1|2|3|4|5|6|7|8|9|10|11|12;

export interface INoteEditable<T> {
  noteType: [T] extends [never] ? TNoteType : T,
  dateEventStart: [T]extends [never] ? number : T,
  dateEventEnd: [T] extends [never] ? number : T,
  photo: [T] extends [never] ? string : T,
  food: [T] extends [never] ? string : T,
  volume: [T] extends [never] ? string : T,
  note: [T] extends [never] ? string : T,
  duration: [T] extends [never] ? string : T,
  milkVolumeLeft: [T] extends [never] ? string : T,
  milkVolumeRight: [T] extends [never] ? string : T,
  type: [T] extends [never] ? string : T,
  achievement: [T] extends [never] ? string : T,
  weight: [T] extends [never] ? string : T,
  growth: [T] extends [never] ? string : T,
  headCircle: [T] extends [never] ? string : T,
  temp: [T] extends [never] ? number : T,
  tags: [T] extends [never] ? string : T,
  pressure: [T] extends [never] ? string : T
}

/* eslint-disable camelcase */
export interface INote {
  id: string,
  diary_id: number,
  server_created_at: number,
  server_updated_at: number,
  server_deleted_at: number,
  created_at: number,
  updated_at: number,
  note_type:  TNoteType,
  date_event_start: number | null,
  date_event_end: number | null,
  photo: string | null,
  food: string | null,
  volume: string | null,
  note: string | null,
  duration: string | null,
  milk_volume_left: string | null,
  milk_volume_right: string | null,
  type: string | null,
  achievement: string | null,
  weight: string | null,
  growth: string | null,
  head_circle: string | null,
  temp: number | null,
  tags: string | null,
  pressure: string | null,
}

export interface INoteBodyPost {
  note: INote
}

export interface INoteBodyPatch {
  note: INote,
}
