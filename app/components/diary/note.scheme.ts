import {FastifySchema} from 'fastify';
import {emailRegex, noteIdRegex} from '@/validation/regex';

//todo везде подобавлять в схему хедеры с токеном
/* eslint-disable camelcase */
export const noteSyncSchemePost: FastifySchema = {
  headers: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {type: 'string'}
    }
  },
  body: {
    type: 'object',
    required: ['changes'],
    properties: {
      changes: {
        type: 'object',
        required: ['notes'],
        properties: {
          notes: {
            type: 'object',
            required: ['created', 'updated', 'deleted'],
            properties: {
              created: {
                type: 'array',
                minItems: 0,
                items: {
                  type: 'object',
                  required: ['diary_id', 'note_type', 'id'],
                  properties: {
                    diary_id: {type: 'number'},
                    id: {type: 'string', pattern: noteIdRegex},
                    note_type: {type: 'number'},
                    date_event_start: {type: 'number'},
                    date_event_end: {type: 'number'},
                    photo: {type: 'string'},
                    food: {type: 'string'},
                    volume: {type: 'string'},
                    note: {type: 'string'},
                    duration: {type: 'string'},
                    milk_volume_left: {type: 'string'},
                    milk_volume_right: {type: 'string'},
                    type: {type: 'string'},
                    achievement: {type: 'string'},
                    weight: {type: 'string'},
                    growth: {type: 'string'},
                    head_circle: {type: 'string'},
                    temp: {type: 'string'},
                    tags: {type: 'string'},
                    pressure: {type: 'string'},
                  }
                },
              },
              updated: {
                type: 'array',
                minItems: 0,
                items: {
                  type: 'object',
                  required: ['diary_id', 'note_type', 'id'],
                  properties: {
                    diary_id: {type: 'number'},
                    id: {type: 'string', pattern: noteIdRegex},
                    note_type: {type: 'number'},
                    date_event_start: {type: 'number'},
                    date_event_end: {type: 'number'},
                    photo: {type: 'string'},
                    food: {type: 'string'},
                    volume: {type: 'string'},
                    note: {type: 'string'},
                    duration: {type: 'string'},
                    milk_volume_left: {type: 'string'},
                    milk_volume_right: {type: 'string'},
                    type: {type: 'string'},
                    achievement: {type: 'string'},
                    weight: {type: 'string'},
                    growth: {type: 'string'},
                    head_circle: {type: 'string'},
                    temp: {type: 'string'},
                    tags: {type: 'string'},
                    pressure: {type: 'string'},
                  }
                },
              },
              deleted: {
                type: 'array',
                items: {
                  type: 'string',
                  minItems: 0
                },
              }
            }
          }
        }
      },
    },
  },
  response: {
    200: {
      type: 'string',
    },
    500: {
      type: 'string'
    }
  },
};
