const { sck, Index, getAdmin, tlang } = require('../lib')

Index(
 {
  pattern: 'deact',
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
  if (!message.isGroup) return message.reply('This feature is only for groups.')
  if (!text) return message.reply(`Please provide a term like:\n1-events\n2-antilink\n3-nsfw\n4-cardgame\n5-economy`)
  if (!isAdmin) return message.reply('This command is only for group admins.')

  switch (text.split(' ')[0]) {
   case 'antilink': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, antilink: 'false' }).save()
     return message.reply('Antilink disabled successfully.')
    } else {
     if (groupSettings.antilink === 'false') return message.reply('Antilink is already disabled.')
     await sck.updateOne({ id: message.chat }, { antilink: 'false' })
     return message.reply('Antilink disabled in the current chat.')
    }
   }

   case 'economy': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, economy: 'false' }).save()
     return message.reply('Economy disabled successfully.')
    } else {
     if (groupSettings.economy === 'false') return message.reply('Economy is already disabled.')
     await sck.updateOne({ id: message.chat }, { economy: 'false' })
     return message.reply('Economy disabled in the current chat.')
    }
   }

   case 'events': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, events: 'false' }).save()
     return message.reply('Events disabled successfully.')
    } else {
     if (groupSettings.events === 'false') return message.reply('Events are already disabled.')
     await sck.updateOne({ id: message.chat }, { events: 'false' })
     return message.reply('Events disabled successfully.')
    }
   }

   case 'cardgame': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, cardgame: 'deactive' }).save()
     return message.reply('Card game disabled successfully.')
    } else {
     if (groupSettings.cardgame === 'deactive') return message.reply('Card game is already disabled.')
     await sck.updateOne({ id: message.chat }, { cardgame: 'deactive' })
     return message.reply('Card game disabled successfully.')
    }
   }

   case 'nsfw': {
    let groupSettings = await sck.findOne({ id: message.chat })
    if (!groupSettings) {
     await new sck({ id: message.chat, nsfw: 'false' }).save()
     return message.reply('NSFW disabled successfully.')
    } else {
     if (groupSettings.nsfw === 'false') return message.reply('NSFW is already disabled.')
     await sck.updateOne({ id: message.chat }, { nsfw: 'false' })
     return message.reply('NSFW disabled successfully.')
    }
   }

   default: {
    return message.reply('Please provide a valid term like:\n1-events\n2-antilink\n3-nsfw\n4-cardgame\n5-economy')
   }
  }
 }
)
