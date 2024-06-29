import bcrypt from 'bcryptjs';

const salt: string = "$2a$10$mjBiK50OQB2g.s.QXSV8zu";

function hashPassword(password: string) : string {
  let hash = bcrypt.hashSync(password, salt);

  return hash;
};

function checkPassword(password: string, hash: string) : boolean {
  const hashedPass = hashPassword(password);

  return (hashedPass === hash);
}

export default {hashPassword, checkPassword};