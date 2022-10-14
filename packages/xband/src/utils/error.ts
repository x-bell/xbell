import debug from 'debug';

export class CustomError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TimeoutError extends CustomError {}

export const debugError = debug('xpeer:error');

export interface ErrorLike extends Error {
  name: string;
  message: string;
}

export function isErrorLike(obj: unknown): obj is ErrorLike {
  return (
    typeof obj === 'object' && obj !== null && 'name' in obj && 'message' in obj
  );
}