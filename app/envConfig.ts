
type TEnv = {
   port: string,
   passSalt: string
}

export const env:TEnv = {
  port: process.env.PORT as string,
  passSalt: process.env['PASS_SALT'] as string
};
