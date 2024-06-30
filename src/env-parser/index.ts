import dotenv from 'dotenv';

// Import this file to parse any env files
export const ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `${__dirname}/../../.env.${ENV}`,
});