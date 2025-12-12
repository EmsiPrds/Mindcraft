import { Document } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
};

// and use it in your service:
export type AccountFilterType = Partial<
  Pick<AccountType, "email" | "username">
>;

export type AccountDocumentType = AccountType & Document;
