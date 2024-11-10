import { Telegraf, Markup } from 'telegraf'

const token = '8124471087:AAGp_FGoAR3D-jMtzpGKlEG_DDNGz4Y69vo'
const webAppUrl = 'https://pbprojeck-87266.web.app'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'Hello! Press to start the app',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open mini app', `${webAppUrl}?ref=${ctx.payload}`),
    ])
  )
})

bot.launch()
