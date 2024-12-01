// bot/app.js

import { Telegraf, Markup } from 'telegraf';

const token = import.meta.env.VITE_TOKEN;

if (!token) {
  throw new Error("Токен Telegram обязателен.");
}

// Используйте токен в вашем коде

const webAppUrl = import.meta.env.VITE_WEB_APP_URL;
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
