# 🪙 CryptoBuddy — Telegram Crypto Assistant Bot

CryptoBuddy is a Telegram bot built with **Node.js**, **TypeScript**, and **Telegraf**, designed to help users with basic cryptocurrency utilities such as:

- 💱 Coin-to-coin & coin-to-USD conversion
- 📰 Latest crypto news and market headlines
- ✅ Interactive step-by-step scenes (Wizard mode)
- 📦 Extendable architecture for future features (alerts, signals, portfolio, etc.)

---

## 🚀 Tech Stack
| Component | Description |
|----------|-------------|
| **Node.js** | Backend runtime |
| **Telegraf** | Telegram Bot Framework |
| **Scenes / Wizard** | Guided multi-step interactions |
| **MongoDB + Mongoose** | Database & session persistence |
| **Express** | Webhook endpoint & health checks |

---

## 📂 Project Structure

├── src
│ ├── bot.ts # Bot instance setup
│ ├── app.ts # Express server for webhook handling
│ ├── handlers
│ │ ├── commandHandler.ts # Handles /commands
│ │ ├── messageHandler.ts # Handles normal text messages
│ │ └── callbackHandler.ts # Handles inline button callbacks
│ ├── scenes
│ │ ├── convertScene.ts # Crypto conversion wizard
│ │ └── newsScene.ts # Crypto news workflow
│ ├── services
│ │ └── priceService.ts # Fetches cryptocurrency price data
│ ├── interfaces
│ │ └── scenesInterface.ts # Typed context + scene data
│ ├── middlewares
│ │ └── validateContext.ts # Context guard middleware
│ ├── config
│ │ └── envSchema.ts # Environment variables validation
│ └── routes
│ └── webhookRoute.ts # Telegram webhook endpoint
└── README.md

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGO_URI=mongodb+srv://...
MONGO_URI_PASSWORD=your_password_here
DATABASE_LOCAL=mongodb://127.0.0.1:27017/cryptobuddy
WEBHOOK_URL=https://your-server.com/webhook
NODE_ENV=DEVELOPMENT
PORT=9091
```

## 🛠 Installation & Setup
1. Clone Repository
```
git clone https://github.com/your-username/cryptobuddy.git
cd cryptobuddy
```

2. Install Dependencies
```
npm install
```

3. Run Bot in Polling Mode (Local Development)
```
npm run dev
```

4. Run Bot with Webhook (Production Mode)
```
npm start
```

If your webhook URL is set in .env, it will automatically register:
```
await bot.telegram.setWebhook(config.WEBHOOK_URL);
```

## 🧭 Commands Overview
Command	Description
/start	Displays welcome menu and feature options
/convert	Start crypto conversion wizard
/news	Show latest crypto news
Others	Extra text is handled by message handler

## 🌐 Webhook Endpoint

CryptoBuddy uses Express to receive Telegram updates when deployed:
```
POST /webhook
```

This is configured in webhookRoute.ts.

## 🔄 Conversion Flow Example

User enters coin they have → BTC

User enters amount → 0.005

Bot asks conversion type:

Convert to USD

Convert to another coin

Bot fetches real-time price

Bot returns:

✅ 0.005 BTC = 142.50 USD

## ✨ Future Features (Planned)

Price alerts & market signals

Portfolio tracking

On-chain address monitoring

## 🤝 Contributing

Pull requests are welcome!
If you plan a major change, please open an issue first.

## 📜 License

MIT License.