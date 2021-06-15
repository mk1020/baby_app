import {FastifyInstance} from 'fastify';
import {checkToken} from '@/hooks';
import {INote, INoteBodyPatch, INoteBodyPost, INoteEditable} from '@/components/diary/types';
import {noteSchemePost} from '@/components/diary/note.scheme';
import {allFieldNote, fieldsNoteByType, queryByNoteField} from '@/components/diary/assistant';

interface IHeaders {
  userId: number
}

export const note = async (server: FastifyInstance) => {
  server.post<{ Body: INoteBodyPost, Headers: IHeaders }>(
    '/diary-note',
    {schema: noteSchemePost, preValidation: checkToken},
    async (req, reply) => {
      const {userId} = req.headers;
      const {note} = req.body;

      const noteFields = fieldsNoteByType[note.noteType];
      const noteValues = [];
      const noteEditDateISO: Record<string, unknown> | INoteEditable<string> = {};

      for (const field of noteFields) {
        if (!note[field]) {
          return reply.status(422).send(`${field} field contains an error or was not passed.`);
        }

        if (field !== 'editDate' && field !== 'id') {
          noteValues.push(note[field]);
          if (field !== 'diaryId') {

            if (note['editDate'][field]) {
              noteEditDateISO[field] = new Date(note['editDate'][field]).toISOString();
            } else {
              return reply.status(422).send(`editDate: ${field} field contains an error or was not passed.`);
            }
          }
        }
      }

      await server.pg.query('INSERT INTO root.diary_note (edit_date, diary_id, note_type, date_event_start, date_event_end, photo, food, note) VALUES ($1, $2, $3, to_timestamp($4 / 1000.0), to_timestamp($5 / 1000.0), $6, $7, $8)', [noteEditDateISO, ...noteValues]);
      return reply.send();
    }
  );

  /*
      * description
      * фронт должен слать обязательные поля: id, diaryId и editDate
      * и ТОЛЬКО те поля, которые обновились.
      * В editDate должны быть даты ВСЕХ обновившихся полей! Пример: {note: timestamp}
      *
  */

  server.patch<{ Body: INoteBodyPatch, Headers: IHeaders }>(
    '/diary-note',
    {schema: noteSchemePost, preValidation: checkToken},
    async (req, reply) => {
      const {userId} = req.headers;
      const {note} = req.body;
      const noteEditableKeys = new Set(Object.keys(note)) as Set<keyof INote>;
      noteEditableKeys.delete('id');
      noteEditableKeys.delete('diaryId');
      noteEditableKeys.delete('editDate');

      const queryExecutingErrLog = [];
      await server.pg.query('BEGIN');
      for (const key of noteEditableKeys as Set<Exclude<keyof INote, 'id' | 'diaryId' | 'editDate'>>) {
        if (allFieldNote.has(key) && note[key]) {
          if (note['editDate'][key]) {
            const dateChangeField = new Date(note['editDate'][key]).toISOString();
            //const sql = format(`UPDATE root.diary_note SET %I = %L WHERE id = 3`, 'note', 'food', 'photo');
            const {rowCount} = await server.pg.query(queryByNoteField[key], [dateChangeField, note[key], note['id'], note['diaryId']]);
            !rowCount &&
              queryExecutingErrLog.push(`UPDATING field ${key}: Something went wrong. May be edit date ${key} is less than the date of this key in the database`);
          } else {
            return reply.status(422).send(`editDate: ${key} field is incorrect or missing`);
          }
        } else {
          return reply.status(422).send(`${key} field is incorrect or his value is null or undefined`);
        }
      }

      if (queryExecutingErrLog.length === 0) {
        await server.pg.query('COMMIT');
        return reply.send();
      } else {
        await server.pg.query('ROLLBACK');
        return reply.status(500).send(queryExecutingErrLog);
      }
    });
};
