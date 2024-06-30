/*
 * A file for global types
 */

export interface CustomReqError extends Error {
  status: number,
  msg: string
};