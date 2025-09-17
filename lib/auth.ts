import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { User } from "@prisma/client";

// Get the JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Token expiration time: 365 days in seconds (31,536,000 seconds)
const EXPIRES_IN = 31536000;

// User payload for the JWT token, excluding sensitive information
export type UserPayload = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
};

// Get user payload from a user object
export const getUserPayload = (user: User): UserPayload => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
  };
};

// Create a JWT token for a user
export const createToken = (user: UserPayload): string => {
  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });

  return token;
};

// Verify and decode a JWT token
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare a password with a hash
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Set the auth token in a cookie
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: EXPIRES_IN,
    path: "/",
  });
};

// Remove the auth token cookie
export const removeAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
};

// Get the auth token from cookies
export const getAuthToken = async (): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
};

// Get the current user from the auth token
export const getCurrentUser = async (): Promise<UserPayload | null> => {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
};

// Check if a user is an admin
export const isAdmin = (user: UserPayload | null): boolean => {
  return user?.role === "admin";
};

// check if token not expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = jwt.decode(token) as { exp?: number };
  return decoded?.exp ? decoded.exp < Date.now() / 1000 : true;
};
