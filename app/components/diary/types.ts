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
  page_id: string,
  diary_id: string,
  user_id: number
  chapter_id: string | null,
  bookmarked: boolean
  title: string
  note: string,
  photo: string | null,
  tags: string | null,
  created_at: number,
  updated_at: number,
  server_created_at: number,
  server_updated_at: number,
  server_deleted_at: number,
}
export interface INoteJS {
  id: string,
  pageId: string,
  diaryId: string,
  userId: number
  chapterId: string | null,
  title: string
  bookmarked: boolean
  note: string,
  photo: string | null,
  tags: string | null,
  createdAt: number,
  updatedAt: number,
}

export interface IPageJS {
  id: string
  diaryId: string
  chapterId: string | null
  name: string
  createdAt: number
  updatedAt: number
  userId: number
}
export interface IPage {
  id: string
  diary_id: string
  chapter_id: string | null
  name: string
  created_at: number
  updated_at: number
  user_id: number
}

export interface IChapterJS {
  id: string
  userId: number
  diaryId: string
  name: string
  number: string
  createdAt: number
  updatedAt: number
}

export interface IChapter {
  id: string
  user_id: number
  name: string
  diary_id: string
  number: string
  created_at: number
  updated_at: number
}