import {createHash, randomBytes} from 'crypto';

export const hash256Salt = (text: string): string => {
  const salt = randomBytes(16);
  const hash = createHash('sha256').update(text).update(salt).digest('base64');
  return  hash;
};
