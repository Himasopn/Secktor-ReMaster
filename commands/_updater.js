const { Index } = require('../lib')
const DB = require('../lib/scraper')

Index(
 {
  pattern: 'update',
  desc: "Shows repo's refreshed commits.",
  category: 'misc',
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply('This command is only for my owner.')
  }

  let commits = await DB.syncgit()
  if (commits.total === 0) {
   citel.reply(`Hey ${citel.pushName}. You have the latest version installed.`)
  } else {
   let update = await DB.sync()
   let msg = {
    text: update,
    footer: 'UPDATER',
    headerType: 4,
   }
   await Void.sendMessage(citel.chat, msg)
  }
 }
)
