const {
 Index,
 jsonformat,
 botpic,
 TelegraPh,
 Config,
 tlang,
 warndb,
 sleep,
 getAdmin,
 getBuffer,
 prefix,
} = require('../lib/index')
const moment = require('moment-timezone')
const fs = require('fs-extra')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const grouppattern = /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{22}/g
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'join',
  desc: 'joins group by link',
  category: 'owner',
  use: '<group link.>',
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  if (!text) {
   return citel.reply(`Please give me Query ${tlang().greet}`)
  }
  if (!text.split(' ')[0] && !text.split(' ')[0].includes('whatsapp.com')) {
   citel.reply('Link Invalid, Please Send a valid whatsapp Group Link!')
  }
  let result = text.split(' ')[0].split('https://chat.whatsapp.com/')[1]
  await Void.groupAcceptInviteV4(result)
   .then(res => citel.reply('🟩Joined Group'))
   .catch(err => citel.reply('Error in Joining Group'))
 }
)
//__________________________________________________________________________
Index(
 {
  pattern: 'groupinfo',
  desc: 'Get group info by link',
  type: 'group',
 },
 async (ctx, args) => {
  try {
   let groupLink = args || ctx.reply_text
   const match = groupLink.match(grouppattern)
   if (!match) {
    return await ctx.reply('Please provide a valid group link.')
   }

   let inviteCode = match[0].split('https://chat.whatsapp.com/')[1].trim()
   const groupInfo = await ctx.bot.groupGetInviteInfo(inviteCode)

   if (groupInfo) {
    const creationDate = new Date(groupInfo.creation * 1000)
    const formattedDate = `${creationDate.getFullYear()}-${(creationDate.getMonth() + 1)
     .toString()
     .padStart(2, '0')}-${creationDate.getDate().toString().padStart(2, '0')}`
    const response = `
          ${groupInfo.subject}
          Creator: wa.me/${groupInfo.owner.split('@')[0]}
          GJid: ${groupInfo.id}
          Muted: ${groupInfo.announce ? 'yes' : 'no'}
          Locked: ${groupInfo.restrict ? 'yes' : 'no'}
          CreatedAt: ${formattedDate}
          Participants: ${groupInfo.size}
          ${groupInfo.desc ? `Description: ${groupInfo.desc}` : ''}
          ${Config.caption}
        `

    const contextInfo = {
     externalAdReply: {
      title: 'ASTA-MD',
      body: groupInfo.subject,
      renderLargerThumbnail: true,
      thumbnail: log0,
      mediaType: 1,
      mediaUrl: match[0],
      sourceUrl: match[0],
     },
    }

    return await ctx.sendMessage(response.trim(), { mentions: [groupInfo.owner], contextInfo })
   } else {
    await ctx.reply('Group Id not found, Sorry!!')
   }
  } catch (error) {
   await ctx.error(`${error}\n\ncommand: groupinfo`, error, 'Group Id not found, Sorry!!')
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'sticker',
  desc: 'Makes sticker of replied image/video.',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!citel.quoted) {
   return citel.reply(`*Mention any Image or video Sir.*`)
  }
  let mime = citel.quoted.mtype
  pack = Config.packname
  author = Config.author
  if (citel.quoted) {
   let media = await citel.quoted.download()
   citel.reply('*Processing Your request*')
   let sticker = new Sticker(media, {
    pack: pack,
    author: author,
    type: text.includes('--crop' || '-c') ? StickerTypes.CROPPED : StickerTypes.FULL,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 75,
    background: 'transparent',
   })
   const buffer = await sticker.toBuffer()
   return Void.sendMessage(
    citel.chat,
    {
     sticker: buffer,
    },
    {
     quoted: citel,
    }
   )
  } else if (/video/.test(mime)) {
   if ((quoted.msg || citel.quoted).seconds > 20) {
    return citel.reply('Cannot fetch videos longer than *20 Seconds*')
   }
   let media = await quoted.download()
   let sticker = new Sticker(media, {
    pack: pack,
    author: author,
    type: StickerTypes.FULL,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 70,
    background: 'transparent', // The sticker background color (only for full stickers)
   })
   const stikk = await sticker.toBuffer()
   return Void.sendMessage(
    citel.chat,
    {
     sticker: stikk,
    },
    {
     quoted: citel,
    }
   )
  } else {
   citel.reply('*Reply to any image or video*')
  }
 }
)
Index(
 {
  pattern: 'reject',
  desc: 'Reject all requests to join!',
  category: 'group',
 },
 async (ctx, args) => {
  try {
   if (!ctx.isGroup) {
    return ctx.reply(tlang().group)
   }

   if (!ctx.isBotAdmin || !ctx.isAdmin) {
    return await ctx.reply(!ctx.isBotAdmin ? "I'm Not Admin In This Group" : tlang().admin)
   }

   const requests = await ctx.client.groupRequestParticipantsList(ctx.chat)
   if (!requests || requests.length === 0) {
    return await ctx.reply('No Join Requests Yet.')
   }

   let rejectedList = 'List of rejected users\n\n'
   for (const request of requests) {
    try {
     await ctx.client.groupRequestParticipantsUpdate(ctx.from, [request.jid], 'reject')
     rejectedList += `@${request.jid.split('@')[0]}\n`
    } catch (error) {
     // handle individual rejection error silently
    }
   }

   await ctx.sendMessage(rejectedList, { mentions: requests.map(r => r.jid) })
  } catch (error) {
   await ctx.error(`${error}\n\ncommand: rejectall`, error)
  }
 }
)

Index(
 {
  pattern: 'accept',
  desc: 'Accept all requests to join!',
  type: 'group',
 },
 async (ctx, args) => {
  try {
   if (!ctx.isGroup) {
    return ctx.reply(tlang().group)
   }

   if (!ctx.isBotAdmin || !ctx.isAdmin) {
    return await ctx.reply(!ctx.isBotAdmin ? "I'm Not Admin In This Group" : tlang().admin)
   }

   const requests = await ctx.client.groupRequestParticipantsList(ctx.chat)
   if (!requests || requests.length === 0) {
    return await ctx.reply('No Join Requests Yet.')
   }

   let acceptedList = 'List of accepted users\n\n'
   for (const request of requests) {
    try {
     await ctx.client.groupRequestParticipantsUpdate(ctx.from, [request.jid], 'approve')
     acceptedList += `@${request.jid.split('@')[0]}\n`
    } catch (error) {
     // handle individual acceptance error silently
    }
   }

   await ctx.sendMessage(acceptedList, { mentions: requests.map(r => r.jid) })
  } catch (error) {
   await ctx.error(`${error}\n\ncommand: acceptall`, error)
  }
 }
)

Index(
 {
  pattern: 'requests',
  desc: 'List all join requests',
  category: 'group',
 },
 async (ctx, args) => {
  try {
   if (!ctx.isGroup) {
    return ctx.reply(tlang().group)
   }

   if (!ctx.isBotAdmin || !ctx.isAdmin) {
    return await ctx.reply(!ctx.isBotAdmin ? "I'm Not Admin In This Group" : tlang().admin)
   }

   const requests = await ctx.client.groupRequestParticipantsList(ctx.chat)
   if (!requests || requests.length === 0) {
    return await ctx.reply('No Join Requests Yet.')
   }

   let requestList = 'List of User Requests to join\n\n'
   for (const request of requests) {
    requestList += `@${request.jid.split('@')[0]}\n`
   }

   return await ctx.sendMessage(requestList, { mentions: requests.map(r => r.jid) })
  } catch (error) {
   await ctx.error(`${error}\n\ncommand: listrequest`, error)
  }
 }
)

Index(
 {
  pattern: 'editdesc',
  desc: 'Set Description of Group',
  category: 'group',
 },
 async (ctx, descText) => {
  try {
   if (!ctx.isGroup) {
    return ctx.reply(tlang().group)
   }

   if (!descText) {
    return await ctx.reply('*Provide Description text you want to set.*')
   }

   if (!ctx.isBotAdmin || !ctx.isAdmin) {
    return await ctx.reply(
     !ctx.isBotAdmin ? "*_I'm Not Admin In This Group" + (!ctx.isCreator ? ', Sir' : '') + '_*' : tlang().admin
    )
   }

   try {
    await ctx.client.groupUpdateDescription(ctx.chat, descText + '\n\n\t' + Config.caption)
    ctx.reply('*_✅Group description updated successfully!_*')
   } catch (error) {
    await ctx.reply("*_Can't update description, Group Id not found!_*")
   }
  } catch (error) {
   await ctx.error(`${error}\n\ncommand: setdesc`, error)
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'support',
  desc: 'Sends official support group link.',
  category: 'group',
  
 },
 async (Void, citel, text) => {
  citel.reply(`*Check your Pm ${tlang().greet}*`)
  await Void.sendMessage(`${citel.sender}`, {
   image: log0,
   caption: `*Group Name: Secktor-Support*\n*Group Link:* https://chat.whatsapp.com/Bl2F9UTVU4CBfZU6eVnrbC`,
  })
 }
)

//---------------------------------------------------------------------------
Index(
 {
  pattern: 'warn',
  desc: 'Warns user in Group.',
  category: 'group',
 },
 async (message, citel, text, { isCreator }) => {
  if (!citel.isGroup) {
   return citel.reply('This Command is only for group.')
  }
  const groupAdmins = await getAdmin(message, citel)
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply('This command is only for Admin.')
  }
  if (!citel.quoted) {
   return citel.reply('Please quote a user master.')
  }
  const timesam = moment(moment()).format('HH:mm:ss')
  moment.tz.setDefault('Asia/KOLKATA').locale('id')
  try {
   let metadata = await message.groupMetadata(citel.chat)
   await new warndb({
    id: citel.quoted.sender.split('@')[0] + 'warn',
    reason: text,
    group: metadata.subject,
    warnedby: citel.pushName,
    date: timesam,
   }).save()
   let ment = citel.quoted.sender
   message.sendMessage(
    citel.chat,
    {
     text:
      '*----Warn----*\nUser: @' +
      citel.quoted.sender.split('@')[0] +
      '\nWith Reason: ' +
      text +
      '\nWarned by: ' +
      citel.pushName,
     mentions: [citel.quoted.sender],
    },
    {
     quoted: citel,
    }
   )
   let h = await warndb.find({
    id: citel.quoted.sender.split('@')[0] + 'warn',
   })
   const Config = require('../config')
   if (h.length > Config.warncount) {
    teskd = 'Removing User because Warn limit exceeded\n\n*All Warnings.*\n'
    let h = await warndb.find({
     id: citel.quoted.sender.split('@')[0] + 'warn',
    })
    teskd += '*There are total ' + h.length + '  warnings.*\n'
    for (let i = 0; i < h.length; i++) {
     teskd += '*' + (i + 1) + '*\n╭─────────────◆\n│ *🍁In Group:-* ' + h[i].group + '\n'
     teskd += '│ *🔰Time:-* ' + h[i].date + '\n'
     teskd += '│ *⚠️Warned by:-* ' + h[i].warnedby + '\n'
     teskd += '│ _📍Reason: ' + h[i].reason + '_\n╰─────────────◆\n\n'
    }
    citel.reply(teskd)
    await message.groupParticipantsUpdate(citel.chat, [citel.quoted.sender], 'remove')
   }
  } catch (Y) {
   console.log(Y)
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'unblock',
  desc: 'Unblocked to the quoted user.',
  category: 'owner',
  
 },
 async (message, citel, text, { isCreator }) => {
  if (!citel.quoted) {
   return citel.reply('Please reply to user')
  }
  if (!isCreator) {
   citel.reply(tlang().owner)
  }
  let users = citel.mentionedJid[0]
   ? citel.mentionedJid[0]
   : citel.quoted
   ? citel.quoted.sender
   : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  await message
   .updateBlockStatus(users, 'unblock')
   .then(res => console.log(jsonformat(res)))
   .catch(err => console.log(jsonformat(err)))
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'ujid',
  desc: 'get jid of all user in a group.',
  category: 'owner',
  
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(e => {}) : ''
  const participants = citel.isGroup ? await groupMetadata.participants : ''
  let textt = `_Here is jid address of all users of_\n *- ${groupMetadata.subject}*\n\n`
  for (let mem of participants) {
   textt += `📍 ${mem.id}\n`
  }
  citel.reply(textt)
 }
)

//---------------------------------------------------------------------------
Index(
 {
  pattern: 'tagall',
  desc: 'Tags every person of group.',
  category: 'group',
  
 },
 async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(e => {}) : ''
  const participants = citel.isGroup ? await groupMetadata.participants : ''
  const groupAdmins = await getAdmin(Void, citel)
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  let textt = `
  ══✪〘   *Tag All*   〙✪══
  
  ➲ *Message :* ${text ? text : 'blank'}\n\n
  ➲ *Author:* ${citel.pushName} 🔖
  `
  for (let mem of participants) {
   textt += `📍 @${mem.id.split('@')[0]}\n`
  }
  Void.sendMessage(
   citel.chat,
   {
    text: textt,
    mentions: participants.map(a => a.id),
   },
   {
    quoted: citel,
   }
  )
 }
)

//---------------------------------------------------------------------------
Index(
 {
  pattern: 'request',
  desc: 'Sends requst to main Bot developer.',
  category: 'group',
  
  use: '<text>',
 },
 async (Void, citel, text) => {
  if (!text) {
   return reply(`Example : ${prefix + command} hello dev please add a downloader feature`)
  }
  textt = `*| REQUEST |*`
  teks1 = `\n\n*User* : @${citel.sender.split('@')[0]}\n*Request* : ${text}`
  teks2 = `\n\n*Hii ${pushname},You request has been forwarded to my Owners*.\n*Please wait.......*`
  for (let i of owner) {
   Void.sendMessage(
    i + '@s.whatsapp.net',
    {
     text: textt + teks1,
     mentions: [citel.sender],
    },
    {
     quoted: citel,
    }
   )
  }
  Void.sendMessage(
   citel.chat,
   {
    text: textt + teks2 + teks1,
    mentions: [citel.sender],
   },
   {
    quoted: citel,
   }
  )
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'retrive',
  desc: 'Copies and Forwords viewonce message.',
  category: 'group',
  
  use: '<reply to a viewonce message.>',
 },
 async (Void, citel, text) => {
  if (!citel.quoted) {
   return reply('Please reply to any message Image or Video!')
  }
  let mime = citel.quoted.mtype
  if (/viewOnce/.test(mime)) {
   const mtype = Object.keys(quoted.message)[0]
   delete quoted.message[mtype].viewOnce
   const msgs = proto.Message.fromObject({
    ...quoted.message,
   })
   const prep = generateWAMessageFromContent(citel.chat, msgs, {
    quoted: citel,
   })
   await Void.relayMessage(citel.chat, prep.message, {
    messageId: prep.key.id,
   })
  } else {
   await citel.reply('please, reply to viewOnceMessage')
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'rwarn',
  desc: 'Deletes all previously given warns of quoted user.',
  category: 'group',
  
  use: '<quote|reply|number>',
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  if (!citel.quoted) {
   return citel.reply('Quote a user master.')
  }
  await warndb.deleteOne({
   id: citel.quoted.sender.split('@')[0] + 'warn',
  })
  return citel.reply('User is now free as a bird.\n.')
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'poll',
  desc: 'Makes poll in group.',
  category: 'group',
  
  use: `question;option1,option2,option3.....`,
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  let [poll, opt] = text.split(';')
  if (text.split(';') < 2) {
   return await citel.reply(`${prefix}poll question;option1,option2,option3.....`)
  }
  let options = []
  for (let i of opt.split(',')) {
   options.push(i)
  }
  await Void.sendMessage(citel.chat, {
   poll: {
    name: poll,
    values: options,
   },
  })
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'profile',
  desc: 'Shows profile of user.',
  category: 'group',
  
 },
 async (Void, citel, text) => {
  try {
   pfp = await Void.profilePictureUrl(citel.sender, 'image')
  } catch (e) {
   pfp = await botpic()
  }
  const profile = `
  *Hii ${citel.pushName},*
  *Here is your profile information*
  *👤Username:* ${citel.pushName}
  *⚡Bio:* ${bioo}
  *🧩Role:* ${role}
  *📥 Total Messages* ${ttms}
  *Powered by ${tlang().title}*
  `
  let buttonMessage = {
   image: {
    url: pfp,
   },
   caption: profile,
   footer: tlang().footer,
   headerType: 4,
  }
  Void.sendMessage(citel.chat, buttonMessage, {
   quoted: citel,
  })
 }
)
Index(
 {
  pattern: 'promote',
  desc: 'Provides admin role to replied/quoted user',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  if (!isBotAdmins) {
   return citel.reply(tlang().botAdmin)
  }
  try {
   let users = citel.mentionedJid[0]
    ? citel.mentionedJid[0]
    : citel.quoted
    ? citel.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
   if (!users) {
    return
   }
   await Void.groupParticipantsUpdate(citel.chat, [users], 'promote')
  } catch {}
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'kick',
  desc: 'Kicks replied/quoted user from group.',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  if (!isBotAdmins) {
   return citel.reply(tlang().botAdmin)
  }
  try {
   let users = citel.mentionedJid[0]
    ? citel.mentionedJid[0]
    : citel.quoted
    ? citel.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
   if (!users) {
    return
   }
   await Void.groupParticipantsUpdate(citel.chat, [users], 'remove')
  } catch {}
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'memegen',
  desc: 'Write text on quoted image.',
  category: 'group',
  
  use: '<text>',
 },
 async (Void, citel, text) => {
  let mime = citel.quoted.mtype
  if (!/image/.test(mime)) {
   return citel.reply(`Reply to Photo With Caption *text*`)
  }
  mee = await Void.downloadAndSaveMediaMessage(citel.quoted)
  mem = await TelegraPh(mee)
  meme = await getBuffer(`https://api.memegen.link/images/custom/-/${text}.png?background=${mem}`)
  let buttonMessage = {
   image: meme,
   caption: 'Here we go',
   footer: tlang().footer,
   headerType: 4,
  }
  Void.sendMessage(citel.chat, buttonMessage, {
   quoted: citel,
  })
  await fs.unlinkSync(mee)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'group',
  desc: 'mute and unmute group.',
  category: 'group',
  
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  if (!isBotAdmins) {
   return citel.reply(tlang().botAdmin)
  }
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  if (text.split(' ')[0] === 'close') {
   await Void.groupSettingUpdate(citel.chat, 'announcement')
    .then(res => reply(`Group Chat Muted :)`))
    .catch(err => console.log(err))
  } else if (text.split(' ')[0] === 'open') {
   await Void.groupSettingUpdate(citel.chat, 'not_announcement')
    .then(res => reply(`Group Chat Unmuted :)`))
    .catch(err => console.log(err))
  } else {
   return citel.reply(`Group Mode:\n${prefix}group open- to open\n${prefix}group close- to close`)
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'grouppic',
  desc: 'Sets a profile pic in Group..',
  category: 'group',
  
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  let mime = citel.quoted.mtype
  if (!citel.isGroup) {
   citel.reply(tlang().group)
  }
  if (!isAdmins) {
   citel.reply(tlang().admin)
  }
  if (!isBotAdmins) {
   citel.reply(tlang().botadmin)
  }
  if (!citel.quoted) {
   return citel.reply(`Send/Reply Image With Caption ${command}`)
  }
  if (!/image/.test(mime)) {
   return citel.reply(`Send/Reply Image With Caption ${command}`)
  }
  if (/webp/.test(mime)) {
   return citel.reply(`Send/Reply Image With Caption ${command}`)
  }
  let media = await Void.downloadAndSaveMediaMessage(citel.quoted)
  await Void.updateProfilePicture(citel.chat, {
   url: media,
  }).catch(err => fs.unlinkSync(media))
  citel.reply(tlang().success)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'hidetag',
  desc: 'Tags everyperson of group without mentioning their numbers',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(e => {}) : ''
  const participants = citel.isGroup ? await groupMetadata.participants : ''
  const groupAdmins = await getAdmin(Void, citel)
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  if (!isAdmins) {
   citel.reply(tlang().admin)
  }
  Void.sendMessage(
   citel.chat,
   {
    text: text ? text : '',
    mentions: participants.map(a => a.id),
   },
   {
    quoted: citel,
   }
  )
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'add',
  desc: 'Add that person in group',
  fromMe: true,
  category: 'group',
 },
 async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!text) {
   return citel.reply('Please provide me number.')
  }
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  if (!isBotAdmins) {
   return citel.reply(tlang().botAdmin)
  }
  let users = citel.mentionedJid[0]
   ? citel.mentionedJid[0]
   : citel.quoted
   ? citel.quoted.sender
   : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  await Void.groupParticipantsUpdate(citel.chat, [users], 'add')
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'getjids',
  desc: 'Sends chat id of every groups.',
  category: 'group',
  
 },
 async (Void, citel, text, { isCreator }) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  let getGroups = await Void.groupFetchAllParticipating()
  let groups = Object.entries(getGroups)
   .slice(0)
   .map(entry => entry[1])
  let anu = groups.map(v => v.id)
  let jackhuh = `All groups jid\n\n`
  citel.reply(`Fetching jid from ${anu.length} Groups`)
  for (let i of anu) {
   let metadata = await Void.groupMetadata(i)
   await sleep(500)
   jackhuh += `*Subject:-* ${metadata.subject}\n`
   jackhuh += `*Member :* ${metadata.participants.length}\n`
   jackhuh += `*Jid:-* ${i}\n\n`
  }
  citel.reply(jackhuh)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'demote',
  desc: 'Demotes replied/quoted user from group',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply(tlang().group)
  }
  const groupAdmins = await getAdmin(Void, citel)
  const botNumber = await Void.decodeJid(Void.user.id)
  const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins) {
   return citel.reply(tlang().admin)
  }
  if (!isBotAdmins) {
   return citel.reply(tlang().botAdmin)
  }
  try {
   let users = citel.mentionedJid[0]
    ? citel.mentionedJid[0]
    : citel.quoted
    ? citel.quoted.sender
    : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
   if (!users) {
    return
   }
   await Void.groupParticipantsUpdate(citel.chat, [users], 'demote')
  } catch {}
 }
)

//---------------------------------------------------------------------------
Index(
 {
  pattern: 'del',
  desc: 'Deletes message of any user',
  category: 'group',
 },
 async (Void, citel, text) => {
  if (citel.quoted.Bot) {
   const key = {
    remoteJid: citel.chat,
    fromMe: false,
    id: citel.quoted.id,
    participant: citel.quoted.sender,
   }
   await Void.sendMessage(citel.chat, {
    delete: key,
   })
  }
  if (!citel.quoted.isBot) {
   if (!citel.isGroup) {
    return citel.reply(tlang().group)
   }
   const groupAdmins = await getAdmin(Void, citel)
   const botNumber = await Void.decodeJid(Void.user.id)
   const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
   const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
   if (!isAdmins) {
    return citel.reply('Only Admins are allowed to delete other persons message.')
   }
   if (!isBotAdmins) {
    return citel.reply("I can't delete anyones message without getting Admin Role.")
   }
   if (!citel.quoted) {
    return citel.reply(`Please reply to any message. ${tlang().greet}`)
   }
   let { chat, fromMe, id } = citel.quoted
   const key = {
    remoteJid: citel.chat,
    fromMe: false,
    id: citel.quoted.id,
    participant: citel.quoted.sender,
   }
   await Void.sendMessage(citel.chat, {
    delete: key,
   })
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'checkwarn',
  desc: 'Check warns',
  category: 'group',
  
  use: '<quoted/reply user.>',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) {
   return citel.reply('This command is only for Group.')
  }
  if (!citel.quoted) {
   return citel.reply('Quote a user master.')
  }
  teskd = `*All Warnings.*\n\n`
  let h = await warndb.find({
   id: citel.quoted.sender.split('@')[0] + 'warn',
  })
  console.log(h)
  teskd += `*There are total ${h.length}  warnings.*\n`
  for (let i = 0; i < h.length; i++) {
   teskd += `*${i + 1}*\n╭─────────────◆\n│ *🍁In Group:-* ${h[i].group}\n`
   teskd += `│ *🔰Time:-* ${h[i].date}\n`
   teskd += `│ *⚠️Warned by:-* ${h[i].warnedby}\n`
   teskd += `│ _📍Reason: ${h[i].reason}_\n╰─────────────◆\n\n`
  }
  citel.reply(teskd)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'block',
  desc: 'blocks that person',
  fromMe: true,
  category: 'owner',
 },
 async (Void, citel, text) => {
  if (!citel.quoted) {
   return citel.reply('Please reply to user')
  }
  if (!isCreator) {
   citel.reply(tlang().owner)
  }
  let users = citel.mentionedJid[0]
   ? citel.mentionedJid[0]
   : citel.quoted
   ? citel.quoted.sender
   : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  await Void.updateBlockStatus(users, 'block')
   .then(res => console.log(jsonformat(res)))
   .catch(err => console.log(jsonformat(err)))
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'broadcast',
  desc: 'Bot makes a broadcast in all groups',
  fromMe: true,
  category: 'group',
 },
 async (Void, citel, text) => {
  if (!isCreator) {
   return citel.reply(tlang().owner)
  }
  let getGroups = await Void.groupFetchAllParticipating()
  let groups = Object.entries(getGroups)
   .slice(0)
   .map(entry => entry[1])
  let anu = groups.map(v => v.id)
  citel.reply(`Send Broadcast To ${anu.length} Group Chat, Finish Time ${anu.length * 1.5} second`)
  for (let i of anu) {
   await sleep(1500)
   let txt = `*--❗${tlang().title} Broadcast❗--*\n\n *🍀Author:* ${citel.pushName}\n\n${text}`
   let buttonMessaged = {
    image: log0,
    caption: txt,
    footer: citel.pushName,
    headerType: 1,
    contextInfo: {
     forwardingScore: 999,
     isForwarded: false,
     externalAdReply: {
      title: 'Broadcast by ' + citel.pushName,
      body: tlang().title,
      thumbnail: log0,
      mediaUrl: '',
      mediaType: 2,
      sourceUrl: gurl,
      showAdAttribution: true,
     },
    },
   }
   await Void.sendMessage(i, buttonMessaged, {
    quoted: citel,
   })
  }
  citel.reply(`*Successful Sending Broadcast To ${anu.length} Group(s)*`)
 }
)
