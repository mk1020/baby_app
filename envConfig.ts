
type TEnvDev = {
   port: string
}

export const envDev:TEnvDev = {
  port: process.env.PORT as string,
};
