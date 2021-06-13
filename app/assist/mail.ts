import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import {env} from '@/envConfig';

export const SMTPOpt: SMTPTransport.Options = {
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: env.mailUserName,
    clientId: env.mailClientId,
    clientSecret: env.mailClientSecret,
    refreshToken: env.mailRefreshToken,
    accessToken: env.mailAccessToken
  }
};
