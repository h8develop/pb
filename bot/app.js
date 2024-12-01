// bot/app.js

import { Telegraf, Markup } from 'telegraf';

const token = "7664874670:AAGuBIo86w4AXw4DzNtoy7mOISEQo91n5xQ";

if (!token) {
  throw new Error("Токен Telegram обязателен.");
}

// Используйте токен в вашем коде

const webAppUrl = "https://pbprojeck-87266.web.app";
if (!webAppUrl) {
  throw new Error("webAppUrl обязателен.");
}
const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  ctx.reply(
    'Hello! Press to start the app',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open mini app', `${webAppUrl}?ref=${ctx.payload}`)
    ])
  )
})

bot.launch();

export default bot;
