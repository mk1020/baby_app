
type TEnvDev = {
   port: string,
   passSalt: string
}

export const envDev:TEnvDev = {
  port: process.env.PORT as string,
  passSalt: process.env['PASS_SALT '] as string
};
