import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  username: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
