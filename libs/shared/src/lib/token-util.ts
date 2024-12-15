export type TokenResponse = {
  yourToken: number;
  tokensCompleted: number;
};

export type AllTokensResponse = Record<
  string,
  TokenResponse & {
    consultantName: string;
  }
>;
