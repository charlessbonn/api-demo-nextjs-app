import bcrypt from 'bcrypt';

export async function hashPassword(password: string, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function authHashSync(password: string, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

export async function authCompareSync(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}