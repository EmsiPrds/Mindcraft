export type AccountType = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  username: string;
  password: string;
  recoveryCode?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthStateType = {
  authUser: AccountType | null;

  loading: boolean;

  registerccount: ({
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    username,
    password,
  }: Partial<AccountType>) => Promise<boolean>;
  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, code: string) => Promise<boolean>;
  checkEmailVerification: (email: string) => Promise<boolean>;
};
