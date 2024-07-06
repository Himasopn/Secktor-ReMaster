const { Index, sck, getAdmin, tlang } = require('../lib')

Index(
 {
  pattern: 'act',
  desc: 'Switches for various functionalities.',
  category: 'group',
  
 },
 async (botInstance, message, text, { isCreator }) => {
  //-----------------------------------------
  if (!message.isGroup) return message.reply(tlang().group)
  const groupAdmins = await getAdmin(botInstance, message)
  const botNumber = await botInstance.decodeJid(botInstance.user.id)
  const isBotAdmin = message.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmin = message.isGroup ? groupAdmins.includes(message.sender) : false
  //-----------------------------------------
  if (!message.isGroup) return message.reply('This command is only for groups.')
  if (!text) return message.reply(`Please provide a term like\n1-events\n2-antilink\n3-nsfw\n4-cardgame\n5-economy`)
  if (!isAdmin) return message.reply('This command is only for group admins.')

  switch (text.split(' ')[0]) {
   case 'antilink': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, antilink: 'true' }).save()
     return message.reply('Antilink Enabled Successfully.')
    } else {
     if (groupSettings.antilink === 'true') return message.reply('Antilink is already enabled here.')
     await sck.updateOne({ id: message.chat }, { antilink: 'true' })
     return message.reply('Antilink Enabled in the current chat.')
    }
   }

   case 'economy': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, economy: 'true' }).save()
     return message.reply('Economy Enabled Successfully.')
    } else {
     if (groupSettings.economy === 'true') return message.reply('Economy is already enabled.')
     await sck.updateOne({ id: message.chat }, { economy: 'true' })
     return message.reply('Economy Enabled in the current chat.')
    }
   }

   case 'events': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, events: 'true' }).save()
     return message.reply('Events Enabled Successfully.')
    } else {
     if (groupSettings.events === 'true') return message.reply('Events are already enabled.')
     await sck.updateOne({ id: message.chat }, { events: 'true' })
     return message.reply('Events Enabled Successfully.')
    }
   }

   case 'cardgame': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, cardgame: 'active' }).save()
     return message.reply('Card Game Enabled Successfully.')
    } else {
     if (groupSettings.cardgame === 'active') return message.reply('Card Game is already enabled.')
     await sck.updateOne({ id: message.chat }, { cardgame: 'active' })
     return message.reply('Card Game Enabled Successfully.')
    }
   }

   case 'nsfw': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, nsfw: 'true' }).save()
     return message.reply('NSFW Enabled Successfully.')
    } else {
     if (groupSettings.nsfw === 'true') return message.reply('NSFW is already enabled.')
     await sck.updateOne({ id: message.chat }, { nsfw: 'true' })
     return message.reply('NSFW Enabled Successfully.')
    }
   }

   default: {
    return message.reply('Please provide a valid term like\n1-events\n2-antilink\n3-nsfw\n4-economy\n5-cardgame')
   }
  }
 }
)
