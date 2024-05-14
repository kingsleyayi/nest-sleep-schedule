import * as bcrypt from 'bcrypt';

export const bcryptPassword = (rawPassword: string) => {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hash(rawPassword, SALT);
};

export const bcryptCompare = (rawPassword: string, hash: string) => {
  return bcrypt.compare(rawPassword, hash);
};
