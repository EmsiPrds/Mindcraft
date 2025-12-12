import Account from "@/models/account.model";
import { AccountFilterType, AccountType } from "@/types/models/account.type";

export const findAccountS = async (
  filter: AccountFilterType
): Promise<AccountType | null> => {
  try {
    const account = await Account.findOne(filter).exec();
    if (!account) return null;
    return account.toObject() as AccountType;
  } catch (err) {
    console.error("Error finding account:", err);
    return null;
  }
};

export const registerAccountS = async (
  accountData: Omit<AccountType, "_id" | "createdAt" | "updatedAt">
): Promise<AccountType> => {
  const account = await Account.create(accountData);
  return account.toObject() as AccountType;
};
