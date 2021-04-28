import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import {usersSchemeGet, usersSchemePost} from './routeSchemes'

interface Params {
  id: number
}

export const users = async (server: FastifyInstance) => {
  server.get<Params>(
    '/users/:id',
    usersSchemeGet,
    async (request: FastifyRequest, reply: FastifyReply) => {
      return 'user1' + request.params.id
    }
  )

  server.post(
    '/users',
    usersSchemePost,
    async (request: FastifyRequest, reply: FastifyReply) => {
      return 'it worked!2'
    }
  )
}
