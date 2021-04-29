import {
   FastifyInstance,
   FastifyReply,
   FastifyRequest,
   RouteShorthandOptions,
} from 'fastify'
import {emailRegex, passRegex} from "../../../common/validation/regex";

export const options: RouteShorthandOptions = {
   schema: {
      body: {
         type: 'object',
         required: ['email', 'password'],
         properties: {
            email: {
               type: 'string',
               pattern: emailRegex,
            },
            password: {
               type: 'string',
               pattern: passRegex,
            },
         },
      },
      response: {
         200: {
            type: 'string',
         },
      },
   },
}

export const register = async (server: FastifyInstance) => {
   server.post(
      '/register',
      options,
      async (request, reply) => {
         return 'it worked!2'
      }
   )
}
