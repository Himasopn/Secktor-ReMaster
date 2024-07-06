const { tlang, sck, prefix, Index } = require('../lib')

Index(
 {
  pattern: 'amute',
  desc: 'Sets auto mute time in group.',
  category: 'moderation',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) return message.reply(tlang().owner)
  if (!message.isGroup) return message.reply(tlang().group)
  if (!args.split(':')[1]) return message.reply(`Please provide the correct format.\nEg: setmute ${prefix}22:00`)

  let groupData = await sck.findOne({ id: message.chat })
  if (!groupData) {
   await new sck({ id: message.chat, mute: args }).save()
   return message.reply('Mute added.')
  } else {
   await sck.updateOne({ id: message.chat }, { mute: args })
   return message.reply(`Mute added for ${args} successfully.`)
  }
 }
)

Index(
 {
  pattern: 'aunmute',
  desc: 'Sets unmute time in group.',
  category: 'moderation',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) return message.reply(tlang().owner)
  if (!message.isGroup) return message.reply(tlang().group)
  if (!args.split(':')[0]) return message.reply(`Please provide the correct format.\nEg: setmute ${prefix}22:00`)

  let groupData = await sck.findOne({ id: message.chat })
  if (!groupData) {
   await new sck({ id: message.chat, unmute: args }).save()
   return message.reply('Unmute added.')
  } else {
   await sck.updateOne({ id: message.chat }, { unmute: args })
   return message.reply(`Unmute updated for ${args} successfully.`)
  }
 }
)

Index(
 {
  pattern: 'dunmute',
  desc: 'Deletes unmute from group.',
  category: 'moderation',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) return message.reply(tlang().owner)
  if (!message.isGroup) return message.reply(tlang().group)

  let groupData = await sck.findOne({ id: message.chat })
  if (!groupData) {
   return message.reply("There's no unmute set in the group.")
  } else {
   await sck.updateOne({ id: message.chat }, { unmute: 'false' })
   return message.reply('Unmute deleted successfully.')
  }
 }
)

Index(
 {
  pattern: 'dmute',
  desc: 'Deletes mute from group.',
  category: 'moderation',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) return message.reply(tlang().owner)
  if (!message.isGroup) return message.reply(tlang().group)

  let groupData = await sck.findOne({ id: message.chat })
  if (!groupData) {
   return message.reply("There's no mute set in the group.")
  } else {
   await sck.updateOne({ id: message.chat }, { mute: 'false' })
   return message.reply('Mute deleted successfully.')
  }
 }
)
