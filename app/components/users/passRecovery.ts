import {FastifyInstance} from 'fastify';
import {randomBytes} from 'crypto';
import {passRecoveryScheme} from '@/components/users/passRecovery.scheme';
import {createTransport} from 'nodemailer';
import {SMTPOpt} from '@/assist/mail';
import {sha256} from '@/components/auth/assistant';

interface IBody {
  email?: string,
  code?: string,
  password?: string,
  confirmPassword?: string
}
export const passRecovery = async (server: FastifyInstance) => {
  server.patch<{Body: IBody}>(
    '/users/password-recovery',
    {schema: passRecoveryScheme},
    async (req, reply) => {
      const {email, code, password, confirmPassword} = req.body;

      if (email) {
        const recoveryCode = randomBytes(48).toString('hex').substring(0, 63);
        const {rowCount} = await server.pg.query('UPDATE root.users SET code = $1 WHERE email = $2', [recoveryCode, email]);

        if (rowCount) {
          const transporter = createTransport(SMTPOpt);
          const mailOptions = {
            to: email,
            subject: 'Password recovery',
            html: `<p>Your recovery code: <br> <b>${recoveryCode}</b> <br>Please copy it to the app</p>`
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
      }

      if (code && password && confirmPassword) {
        const hash = sha256(password);
        const {rowCount} = await server.pg.query('UPDATE root.users SET code = NULL, password_hash = $1 WHERE code = $2', [hash, code]);

        if (rowCount) {
          return reply.send('You have successfully changed your password!');
        } else {
          return reply.status(500).send('Something went wrong. Check the code');
        }
      }
    });
};
