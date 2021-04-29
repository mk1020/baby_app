import {FastifyInstance, FastifyReply, FastifyRequest, RequestGenericInterface} from "fastify";
import {usersSchemeGet, usersSchemePost} from './routeSchemes'

interface IParams {
  id: number
}
interface IBody {

}

export const users = async (server: FastifyInstance) => {
  server.get<{Params: IParams }>(
     '/users/:id',
     usersSchemeGet,
     async (request, reply) => {
        return 'user1' + request.params.id
     }
  )

  server.post<{Params: IParams, Body: IBody}>(
    '/users',
    usersSchemePost,
    async (request, reply) => {
      return 'it worked!2'
    }
  )
}
