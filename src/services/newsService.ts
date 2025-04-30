// import { MongoClient } from "mongodb";
// import { config } from "../config/envSchema";
// import { Subscriber } from "../models/subscribeModel";

// // Add a subscriber
// export async function addSubscriber(chatId: number) {
//   await subscribers.updateOne({ chatId }, { $set: { chatId } }, { upsert: true });
// }

// // Remove a subscriber
// export async function removeSubscriber(chatId: number) {
//   await subscribers.deleteOne({ chatId });
// }

// // Check if user is subscribed
// export async function isSubscribed(chatId: number): Promise<boolean> {
//   const user = await subscribers.findOne({ chatId });
//   return !!user;
// }

// // Get all subscribers
// export async function getAllSubscribers(): Promise<number[]> {
//   const users = await subscribers.find().toArray();
//   return users.map((user) => user.chatId);
// }
