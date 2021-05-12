import {createHash, randomBytes} from 'crypto';

export const sha256 = (text: string, salt?: string): string => {
  const hash = createHash('sha256').update(text + salt).digest('hex');
  return hash;
};
