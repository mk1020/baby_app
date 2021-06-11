import {FastifyInstance} from 'fastify';
import {signUpScheme} from './signUp.scheme';
import {sha256} from './assistant';
import {createTransport} from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import {SMTPOpt} from '@/assist/mail';

interface IBody {
   email: string
   password: string
   confirmPassword: string
}

export const signUp = async (server: FastifyInstance) => {
  server.post<{Body: IBody}>(
    '/signup',
    signUpScheme,
    async (req, reply) => {
      const {password, email} = req.body;
      const hash = sha256(password);
      const {rowCount} = await server.pg.query('insert into root.users (email, password_hash) values ($1, $2)', [email, hash]);

      if (rowCount) {
        const transporter = createTransport(SMTPOpt);
        const mailOptions = {
          to: '1michael.kovalchuk@gmail.com',
          subject: 'Confirmation of registration',
          html: '<h1>Hello.</h1> <p>Please click on the link to confirm your registration.</p>'
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
