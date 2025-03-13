const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");

const MY_TOKEN = "";
const BASE_URL = "";
const axiosInstance = getAxiosInstance(BASE_URL);


function sendMessage(chatId, messageText) {
    return axiosInstance
        .get("sendMessage", {
            chat_id: chatId,
            text: messageText,
        })
        .catch((ex) => {
            errorHandler(ex, "sendMessage", "axios");
        });
}

async function handleMessage(messageObj) {
    const messageText = messageObj.text || "";
    if (!messageText) {
        errorHandler("No message text", "handleMessage");
        return "";
    }

    try {
        const chatId = messageObj.chat.id;
        if (messageText.charAt(0) === "/") {
            const command = messageText.substr(1);

            switch (command) {
                case "start":
                    return sendMessage(
                        chatId,
                        "Hi! I am cryptobuddy, i can help you with your crypto problems"
                    );
                default: 
                    return sendMessage(chatId, "Ohh! i don't know that command")
            }
        }
    } catch (error) {
        errorHandler(error, "handleMessage");
    }

}

module.exports = { sendMessage };