const throwErrorMessage = (message: string) => {
  throw new Error(message);
};

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_SECRET =
  process.env.JWT_SECRET || throwErrorMessage('JWT_SECRET is required');
export const SLAT_HASH_ROUNDS =
  process.env.SLAT_HASH_ROUNDS ||
  throwErrorMessage('SLAT_HASH_ROUNDS is required');
