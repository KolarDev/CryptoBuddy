import { Subscription } from "../models/subscribeModel";

// Add a subscription type to a user
export async function addSubscription(chatId: number, type: string) {
  await Subscription.findOneAndUpdate(
    { chatId },
    { $addToSet: { types: type } }, // Adds to array if not already present
    { upsert: true, new: true }
  );
}

// Remove a subscription type from a user
export async function removeSubscription(chatId: number, type: string) {
  await Subscription.findOneAndUpdate(
    { chatId },
    { $pull: { types: type } }, // Removes the type from the array
    { new: true }
  );
}

// Check if a user is subscribed to a specific type
export async function isSubscribed(
  chatId: number,
  type: string
): Promise<boolean> {
  const userSub = await Subscription.findOne({ chatId, types: type });
  return !!userSub;
}

// Get all users subscribed to a specific type
export async function getSubscribersByType(type: string): Promise<number[]> {
  const subscribers = await Subscription.find({ types: type }).select("chatId");
  return subscribers.map((sub: { chatId: any }) => sub.chatId);
}

// Get all subscriptions of a user
export async function getUserSubscriptions(chatId: number): Promise<string[]> {
  const subscription = await Subscription.findOne({ chatId }).select("types");
  return subscription ? subscription.types : [];
}
