import {createHash} from 'crypto';
import {env} from '../../envConfig';
import {OAuth2Client} from 'google-auth-library';
import {TokenPayload} from 'google-auth-library/build/src/auth/loginticket';
import {FastifyInstance} from 'fastify';
import {addNewToken} from '@/components/users/token';
import {warn} from 'google-auth-library/build/src/messages';

export const sha256 = (text: string): string => {
  const hash = createHash('sha256').update(text + env.passSalt).digest('hex');
  return hash;
};

const googleClientID = '383429019755-1g1ffu4bhcr1nm3tdp0ojbenr3ifprej.apps.googleusercontent.com';
const client = new OAuth2Client(googleClientID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientID,
  });
  const payload = ticket.getPayload();
  const userid = payload && payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  if (payload) {
    return payload;
  } else {
    return Promise.reject('verifyIdToken error');
  }
};

const generateRandomPass = (length: number) => {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};
export const findOrCreateUser = async (server: FastifyInstance, userPayload: TokenPayload): Promise<number> => {
  const {rows} = await server.pg.query('SELECT id FROM root.users WHERE email=$1', [userPayload.email]);
  if (rows.length) {
    return rows[0].id;
  } else {
    const hash = sha256(generateRandomPass(8));
    const {rows} = await server.pg.query('insert into root.users (email, password_hash, confirmed) values ($1, $2, true) RETURNING id', [userPayload.email, hash]);

    if (rows.length) {
      return rows[0].id;
    } else {
      return Promise.reject('Error writing to the database by create user');
    }
  }
};

export const createDiaryIfNotExist = async (server: FastifyInstance, userId: number, diaryId: string) => {
  const {rows: diary} = await server.pg.query('SELECT id FROM root.diaries WHERE id=$1 OR user_id=$2', [diaryId, userId]);
  if (diary.length) {
    return diaryId;
  } else {
    const {rows} = await server.pg.query('insert into root.diaries (id, user_id, server_deleted_at, server_updated_at, server_created_at) values ($1, $2, null, now(), now()) RETURNING id', [diaryId, userId]);
    if (rows.length) {
      return rows[0].id;
    } else {
      return Promise.reject('Error writing to the database by create user');
    }
  }

};
