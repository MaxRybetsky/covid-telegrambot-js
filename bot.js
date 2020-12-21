require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRY_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет, ${ctx.message.from.first_name}
Узнай статистику по Коронавирусу. 
Введи название страны на английском языке и получи статистику.
Посмотреть весь список стран можно командой /help.
`,
    Markup.keyboard([
      ['US', 'Russia'],
      ['Ukraine', 'Kazakhstan'],
    ])
      .resize()
      .extra()
  )
);
bot.help((ctx) => ctx.reply(COUNTRY_LIST));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    console.log('Error');
    ctx.reply('Такой страны не существует, посмотри /help');
  }
});
bot.launch();
console.log('Bot launched');
