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

export interface INote<NoteEditDate=number> extends INoteEditable<never>{
  id?: number,
  diaryId: number,
  editDate: INoteEditable<NoteEditDate>,
}

export interface INoteBodyPost {
  note: INote
}

export interface INoteBodyPatch {
  note: INote,
}
