import { Telegraf, Context, Scenes, session } from "telegraf";
import { config } from "./config/envSchema";
import { convertScene } from "./scenes/convertScene";
import { handleMessage } from "./handlers/messageHandler";
import { handleCommand } from "./handlers/commandHandler";
import { validateContext } from "./middlewares/validateContext";

// Define the session data type (you can add more fields as needed)
interface MySceneSession extends Scenes.SceneSessionData {
  myCustomData?: string;
}

// Extend Telegraf's default context with scene session
interface MyContext extends Context {
  session: Scenes.SceneSession<MySceneSession>;
  scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
}

// Create bot instance with the correct context type
const bot = new Telegraf<MyContext>(config.TELEGRAM_BOT_TOKEN!);

// Register Scene
const stage = new Scenes.Stage<MyContext>([convertScene]);

// Middleware
bot.use(session()); // Enable session
bot.use(stage.middleware()); // Enable scenes

bot.use(validateContext);

export default bot;
