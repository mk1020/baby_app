
type TEnv = {
  nodeEnv: string,
  port: string,
  passSalt: string,
  host: string,
  mailUserName: string,
  mailClientId: string,
  mailClientSecret: string,
  mailAccessToken: string,
  mailRefreshToken: string,
}

export const env:TEnv = {
  nodeEnv: process.env.NODE_ENV as string,
  port: process.env.PORT as string,
  host: process.env.HOST as string,
  passSalt: process.env.PASS_SALT as string,
  mailUserName: process.env.MAIL_USERNAME as string,
  mailClientId: process.env.MAIL_OAUTH_CLIENTID as string,
  mailClientSecret: process.env.MAIL_OAUTH_CLIENT_SECRET as string,
  mailRefreshToken: process.env.MAIL_OAUTH_REFRESH_TOKEN as string,
  mailAccessToken: process.env.MAIL_OAUTH_ACCESS_TOKEN as string,
};
