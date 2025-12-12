import { findAccountS, registerAccountS } from "@/services/auth/auth.service";
import { comparePassword, hashPassword } from "@/utils/bycrypt/bycrypt";
import { AppError } from "@/utils/error/appError";
import { isEmailVerified } from "@/services/otp/otp.service";
import generateToken from "@/utils/jwt/generateToken";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  const { firstName, middleName, lastName, suffix, email, username, password } =
    req.body;

  // 1. Validate required fields
  const requiredFields: Record<string, string | undefined> = {
    "First name": firstName,
    "Last name": lastName,
    Email: email,
    Password: password,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new AppError(`${field} is required.`, 400);
    }
  }

  // 2. Check duplicates
  if (await findAccountS({ email })) {
    throw new AppError("Email already exists.", 409);
  }

  if (await findAccountS({ username })) {
    throw new AppError("Username already exists.", 409);
  }

  // 2.5. Check if email is verified
  const emailVerified = await isEmailVerified(email);
  if (!emailVerified) {
    throw new AppError("Please verify your email address first.", 400);
  }

  // 3. Hash password
  const hashedPassword = await hashPassword(password);

  // 4. Create account
  const account = await registerAccountS({
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    username,
    password: hashedPassword,
  });

  // 5. Generate token
  generateToken(account._id, res);

  // 6. Return response
  res.status(200).json({
    message: "Account registered successfully.",
    user: {
      _id: account._id,
      firstName: account.firstName,
      middleName: account.middleName,
      lastName: account.lastName,
      email: account.email,
      username: account.username,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username) {
    throw new AppError("Username is required.", 400);
  }
  if (!password) {
    throw new AppError("Password is required.", 400);
  }

  const account = await findAccountS({ username });
  if (!account) {
    throw new AppError("Account not found.", 404);
  }

  const isPasswordCorrect = await comparePassword(
    password,
    account.password || ""
  );
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect credentials.", 401);
  }

  generateToken(account._id, res);

  const user = {
    _id: account._id,
    firstName: account.firstName,
    middleName: account.middleName,
    lastName: account.lastName,
    email: account.email,
    username: account.username,
  };

  res.status(200).json({ message: "Login successfuly.", user });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};
