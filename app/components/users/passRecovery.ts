import {FastifyInstance} from 'fastify';
import {randomBytes} from 'crypto';
import {passResetScheme, usersPasswordScheme} from '@/components/users/passRecovery.scheme'
import {createTransport} from 'nodemailer';
import {SMTPOpt} from '@/assist/mail';
import {sha256} from '@/components/auth/assistant';

interface IBodyPassReset {
  email: string,
}
interface IBodyUsersPassword {
  email: string,
  code: string,
  password: string,
  confirmPassword: string
}
export const passRecovery = async (server: FastifyInstance) => {
  server.patch<{Body: IBodyPassReset}>(
    '/password-reset',
    {schema: passResetScheme},
    async (req, reply) => {
      const {email} = req.body;

      const recoveryCode = Math.floor(Math.random() * 10000000).toString();
      const {rowCount} = await server.pg.query('UPDATE root.users SET code = $1 WHERE email = $2', [recoveryCode, email]);

      if (rowCount) {
        const transporter = createTransport(SMTPOpt);
        const mailOptions = {
          to: email,
          subject: 'Password recovery',
          html: `<p>Your recovery code: <b>${recoveryCode}</b> <br>Please copy it to the app</p>`
        };
        const sent = await transporter.sendMail(mailOptions);

        if (sent) {
          return reply.status(200).send('An email has been sent to your email address');
        } else {
          return reply.status(500).send('Couldn\'t send email.');
        }
      } else {
        return reply.status(500).send('Failed to write to the database');
      }
    });

  server.patch<{Body: IBodyUsersPassword}>(
    '/users/password',
    {schema: usersPasswordScheme},
    async (req, reply) => {
      const {email, code, password} = req.body;

      const hash = sha256(password);
      const {rowCount} = await server.pg.query('UPDATE root.users SET code = NULL, password_hash = $1 WHERE code = $2 AND email=$3', [hash, code, email]);

      if (rowCount) {
        return reply.send('You have successfully changed your password!');
      } else {
        return reply.status(500).send('Something went wrong. Check the code');
      }
    });
};
