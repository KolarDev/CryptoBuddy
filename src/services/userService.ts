import { User } from "../models/userModel";
import { sendMessage } from "../config/axios";

export async function registerUser(
  chatId: number,
  username: string,
  firstName: string,
  lastName: string
) {
  const existingUser = await User.findOne({ chatId });

  if (!existingUser) {
    await User.create({ chatId, username, firstName, lastName });
    sendMessage(chatId, "✅ You have been registered successfully!");
  }
}
