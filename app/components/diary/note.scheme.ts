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
                  required: ['diary_id', 'user_id', 'id', 'page_id', 'title', 'note'],
                  properties: {
                    diary_id: {type: 'string'},
                    chapter_id: {type: 'string'},
                    page_id: {type: 'string'},
                    user_id: {type: 'number'},
                    id: {type: 'string', pattern: noteIdRegex},
                    photo: {type: 'string'},
                    title: {type: 'string'},
                    note: {type: 'string'},
                    bookmarked: {type: 'boolean'},
                    tags: {type: 'string'},
                    created_at: {type: 'number'},
                    updated_at: {type: 'number'},
                  }
                },
              },
              updated: {
                type: 'array',
                minItems: 0,
                items: {
                  type: 'object',
                  required: ['diary_id', 'user_id', 'id', 'page_id', 'title', 'note'],
                  properties: {
                    diary_id: {type: 'string'},
                    chapter_id: {type: 'string'},
                    page_id: {type: 'string'},
                    user_id: {type: 'number'},
                    id: {type: 'string', pattern: noteIdRegex},
                    photo: {type: 'string'},
                    title: {type: 'string'},
                    note: {type: 'string'},
                    bookmarked: {type: 'boolean'},
                    tags: {type: 'string'},
                    created_at: {type: 'number'},
                    updated_at: {type: 'number'},
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
