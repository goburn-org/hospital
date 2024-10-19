type NODE_ENV = 'development' | 'production';

const throwErrorMessage = (message: string) => {
  throw new Error(message);
};

export const NODE_ENV = (import.meta.env.VITE_NODE_ENV ||
  'development') as NODE_ENV;
