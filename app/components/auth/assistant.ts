import {createHash} from 'crypto';
import {env} from '../../envConfig';

export const sha256 = (text: string): string => {
  const hash = createHash('sha256').update(text + env.passSalt).digest('hex');
  return hash;
};
