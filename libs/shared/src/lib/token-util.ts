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

export type OrderTokenResponse = {
  orderName: string;
  total: number;
  completed: number;
};

export type AllOrderTokenResponse = Record<string, OrderTokenResponse>;
