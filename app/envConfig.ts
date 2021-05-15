
type TEnv = {
   port: string,
   passSalt: string,
   host: string,
}

export const env:TEnv = {
  port: process.env.PORT as string,
  host: process.env.HOST as string,
  passSalt: process.env['PASS_SALT'] as string
};
