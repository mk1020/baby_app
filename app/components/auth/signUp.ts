import {FastifyInstance} from 'fastify';
import {signUpConfirmScheme, signUpScheme} from './signUp.scheme';
import {sha256} from './assistant';
import {createTransport} from 'nodemailer';
import {SMTPOpt} from '@/assist/mail';
import {randomBytes} from 'crypto';
import {env} from '@/envConfig';
import * as crypto from 'crypto';

interface IBody {
   email: string
   password: string
   confirmPassword: string
}

export const signUp = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/signup',
    {schema: signUpScheme},
    async (req, reply) => {
      const {password, email} = req.body;
      const hash = sha256(password);
      const linkCode = randomBytes(48).toString('hex').substring(0, 63);
      const {rowCount} = await server.pg.query('insert into root.users (email, password_hash, code) values ($1, $2, $3)', [email, hash, linkCode]);

      if (rowCount) {
        const transporter = createTransport(SMTPOpt);
        const link = `http://${env.nodeEnv === 'development' ? 'localhost:3000' : '51.15.71.195'}/signup/confirm/?code=${linkCode}`;
        const mailOptions = {
          to: email,
          subject: 'Confirmation of registration',
          html: `<h3>Hello.</h3> <p>Please click on the <a href=${link}><b>link</b></a> to confirm your registration.</p>`
        };

        const sent = await transporter.sendMail(mailOptions);

        if (sent) {
          return reply.status(201).send('An email has been sent to your email address');
        } else {
          return reply.status(500).send('Couldn\'t send email.');
        }
      } else {
        return reply.status(500).send('Failed to write to the database');
      }
    }
  );
};

interface IQuerystring {
  code: string
}
export const signUpConfirm = async (server: FastifyInstance) => {
  server.get<{Querystring: IQuerystring}>(
    '/signup/confirm/',
    {schema: signUpConfirmScheme},
    async (req, reply) => {
      const {code} = req.query;

      const {rowCount} = await server.pg.query('UPDATE root.users SET confirmed = true, code = NULL WHERE code = $1 AND confirmed = false', [code]);
      if (rowCount) {
        reply.type('text/html').send('<h2>Registration has been successfully confirmed!</h2>');
      } else {
        reply.type('text/html').code(500).send('<h2>Oops! Something went wrong. Most likely your account has already been verified!</h2>');
      }
    }
  );
};
