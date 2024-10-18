const throwErrorMessage = (message: string) => {
  throw new Error(message);
};

export const NODE_ENV = process.env.NODE_ENV || "development";
