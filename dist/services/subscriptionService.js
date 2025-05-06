"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscription = addSubscription;
exports.removeSubscription = removeSubscription;
exports.isSubscribed = isSubscribed;
exports.getSubscribersByType = getSubscribersByType;
exports.getUserSubscriptions = getUserSubscriptions;
const subscribeModel_1 = require("../models/subscribeModel");
// Add a subscription type to a user
function addSubscription(chatId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        yield subscribeModel_1.Subscription.findOneAndUpdate({ chatId }, { $addToSet: { types: type } }, // Adds to array if not already present
        { upsert: true, new: true });
    });
}
// Remove a subscription type from a user
function removeSubscription(chatId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        yield subscribeModel_1.Subscription.findOneAndUpdate({ chatId }, { $pull: { types: type } }, // Removes the type from the array
        { new: true });
    });
}
// Check if a user is subscribed to a specific type
function isSubscribed(chatId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const userSub = yield subscribeModel_1.Subscription.findOne({ chatId, types: type });
        return !!userSub;
    });
}
// Get all users subscribed to a specific type
function getSubscribersByType(type) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscribers = yield subscribeModel_1.Subscription.find({ types: type }).select("chatId");
        return subscribers.map((sub) => sub.chatId);
    });
}
// Get all subscriptions of a user
function getUserSubscriptions(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const subscription = yield subscribeModel_1.Subscription.findOne({ chatId }).select("types");
        return subscription ? subscription.types : [];
    });
}
