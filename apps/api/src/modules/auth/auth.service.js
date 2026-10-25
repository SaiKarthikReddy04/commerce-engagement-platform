import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./auth.repository.js";

function createError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function createAccessToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from the environment.");
  }

  return jwt.sign(
    { role: user.role },
    secret,
    {
      subject: user._id.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    },
  );
}

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "SHOPPER",
    });

    return {
      user: toPublicUser(user),
      accessToken: createAccessToken(user),
    };
  } catch (error) {
    if (error.code === 11000) {
      throw createError(409, "EMAIL_ALREADY_REGISTERED", "That email is already registered.");
    }

    throw error;
  }
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email.toLowerCase());

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw createError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
  }

  if (user.status !== "ACTIVE") {
    throw createError(403, "ACCOUNT_LOCKED", "This account is locked.");
  }

  return {
    user: toPublicUser(user),
    accessToken: createAccessToken(user),
  };
}