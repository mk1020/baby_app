import {FastifySchema} from 'fastify';

export const noteSchemePost: FastifySchema = {
  body: {
    type: 'object',
    required: ['note'],
    properties: {
      note: {
        type: 'object',
        required: ['diaryId', 'noteType', 'id'],
        properties: {
          diaryId: {type: 'number'},
          id: {type: 'number'},
          noteType: {type: 'number'},
          dateEventStart: {type: 'number'},
          dateEventEnd: {type: 'number'},
          photo: {type: 'string'},
          food: {type: 'string'},
          volume: {type: 'string'},
          note: {type: 'string'},
          duration: {type: 'string'},
          milkVolumeLeft: {type: 'string'},
          milkVolumeRight: {type: 'string'},
          type: {type: 'string'},
          achievement: {type: 'string'},
          weight: {type: 'string'},
          growth: {type: 'string'},
          headCircle: {type: 'string'},
          temp: {type: 'string'},
          tags: {type: 'string'},
          pressure: {type: 'string'},
        }
      },
    },
  },
  response: {
    200: {
      type: 'string',
    },
    422: {
      type: 'string'
    }
  },
};
//todo сделать схему для patch