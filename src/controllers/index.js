const { handleMessage, sendMessage } = require("./lib/telegram");
const { errorHandler } = require("./lib/helpers");

async function handler(req, method) {
  try {
    if (method === "GET") {
      return "Hello GET";
    }

    const { body } = req;
      if (body && body.message) {
        const messageObj = body.message;
        await handleMessage(messageObj);
        return "success";
      }
      return "unknown request";
  } catch (error) {
    errorHandler(error, "mainIndexhandler");
  }
}

module.exports = { handler };