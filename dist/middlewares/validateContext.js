"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContext = validateContext;
function validateContext(ctx, next) {
    var _a;
    if (!ctx.chat || !ctx.from) {
        console.error("🚨 Missing chat or user information.");
        return (_a = ctx.reply) === null || _a === void 0 ? void 0 : _a.call(ctx, "⚠️ Unable to process request.");
    }
    return next(); // Proceed to the next middleware or handler
}
