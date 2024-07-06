const { tlang, sleep, Index } = require('../lib')
Index(
 {
  pattern: 'restart',
  desc: 'To restart bot',
  category: 'tools',
  
 },
 async (context, message, txt, { isCreator }) => {
  if (!isCreator) return message.reply(tlang().owner)
  const { exec } = require('child_process')
  message.reply('Restarting')
  await sleep(2000)
  exec('pm2 restart all')
 }
)
