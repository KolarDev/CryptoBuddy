# Telegram Bot (Node.js)

A Telegram bot built using **Node.js** and the **node-telegram-bot-api** library.  
This project provides a clean base structure to build interactive Telegram bots with commands, inline keyboards, and more.

---

## Features
- Handles regular text messages and Telegram commands
- Supports inline buttons and callback queries
- Uses long-polling by default (no webhook setup required)
- Simple and easy to extend

---

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v14+ | https://nodejs.org |
| npm | v6+ | Included with Node.js |
| Telegram | Latest | https://telegram.org/apps |

Also, create a bot using **BotFather** on Telegram:

1. Open Telegram and search for **@BotFather**
2. Run: `/newbot`
3. Follow the steps to name your bot
4. Copy your **Bot Token**

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-telegram-bot.git
cd your-telegram-bot
