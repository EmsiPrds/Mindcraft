import Account from "@/models/account.model";
import type { Request } from "express";

export interface CustomRequest extends Request {
  account?: typeof Account.prototype;
}
