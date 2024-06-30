/*
 * A file for global types
 */

export interface CustomError extends Error {
  status: number,
  msg: string
};