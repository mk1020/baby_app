import {
   FastifyInstance,
   FastifyReply,
   FastifyRequest,
   RouteShorthandOptions,
} from 'fastify'
import {emailRegex, passRegex} from '../../../common/validation/regex'

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

export const signIn = async (server: FastifyInstance) => {
   server.post(
      '/signin',
      options,
      async (request: FastifyRequest, reply: FastifyReply) => {
         return 'it worked!1'
      }
   )
}
