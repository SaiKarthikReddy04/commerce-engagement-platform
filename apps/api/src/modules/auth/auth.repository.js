import { User } from "../users/user.model.js";

export function findUserByEmail(email) {
  return User.findOne({ email }).select("+passwordHash");
}

export function createUser(userData) {
  return User.create(userData);
}