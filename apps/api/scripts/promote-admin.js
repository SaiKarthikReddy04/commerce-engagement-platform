import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { User } from "../src/modules/users/user.model.js";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error(
      "Provide the email of an existing user: node scripts/promote-admin.js <email>",
    );
  }

  await connectDatabase();

  const user = await User.findOneAndUpdate(
    { email },
    { role: "ADMIN" },
    { returnDocument: "after", runValidators: true },
  ).select("name email role");

  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  console.log(`Promoted ${user.email} to ${user.role}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });