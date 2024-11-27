// bot/app.js

import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import logger from '/logger.js';

dotenv.config();

const token = "8124471087:AAGp_FGoAR3D-jMtzpGKlEG_DDNGz4Y69vo"
if (!token) {
  throw new Error('BOT_TOKEN не определён в переменных окружения.');
}
const webAppUrl = 'https://pbprojeck-87266.web.app';

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  const ref = ctx.startPayload || 'unknown';
  ctx.reply(
    'Привет! Нажми, чтобы начать приложение',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть мини-приложение', `${webAppUrl}?ref=${ref}`),
    ])
  );
});

bot.launch();

export default bot;
