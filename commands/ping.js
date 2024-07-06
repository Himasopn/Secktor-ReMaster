const { Index } = require('../lib')

Index(
 {
  pattern: 'ping',
  desc: 'To check ping',
  category: 'general',
 },
 async (message, ctx) => {
  var inital = new Date().getTime()
  const { key } = await message.sendMessage(ctx.chat, { text: '```Ping!!!```' })
  var final = new Date().getTime()
  return await message.sendMessage(ctx.chat, { text: '*Pong!*\nLatency *' + (final - inital) + ' ms* ', edit: key })
 }
)
