import {FastifyInstance} from "fastify";
import {register} from "../components/unauthorized/register/register";
import {signIn} from "../components/unauthorized/signIn/signIn";
import {signOut} from "../components/authorized/signOut/signOut";
import {users} from "../components/authorized/users/users";

export const registerRoutes = (server: FastifyInstance)=> {
  server.register(register);
  server.register(signIn)
  server.register(signOut)
  server.register(users)
}
