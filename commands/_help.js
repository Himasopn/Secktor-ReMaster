const os = require('os')
const moment = require('moment-timezone')
const Config = require('../config')
const { fancytext, tlang, tiny, runtime, formatp, botpic, prefix, sck1 } = require('../lib')
const { Index } = require('../lib/commands')
const long = String.fromCharCode(8206)
const readmore = long.repeat(4001)

//---------------------------------------------------------------------------
Index(
 {
  pattern: 'menu',
  desc: 'Help list',
  category: 'general',
 },
 async (message, client, args) => {
  const { commands } = require('../lib')
  if (args.split(' ')[0]) {
   let arr = []
   const cmd = commands.find(cmd => cmd.pattern === args.split(' ')[0].toLowerCase())
   if (!cmd) return await client.reply('*No such command.*')
   else arr.push(`*🍁Command:* ${cmd.pattern}`)
   if (cmd.category) arr.push(`*🧩Category:* ${cmd.category}`)
   if (cmd.alias) arr.push(`*🧩Alias:* ${cmd.alias}`)
   if (cmd.desc) arr.push(`*🧩Description:* ${cmd.desc}`)
   if (cmd.use) arr.push(`*〽️Usage:*\n\`\`\`${prefix}${cmd.pattern} ${cmd.use}\`\`\``)
   return await client.reply(arr.join('\n'))
  } else {
   const cmds = {}
   commands.map(async command => {
    if (command.dontAddCommandList === false && command.pattern !== undefined) {
     if (!cmds[command.category]) cmds[command.category] = []
     cmds[command.category].push(command.pattern)
    }
   })
   const time = moment().format('HH:mm:ss')
   moment.tz.setDefault('Asia/Kolkata').locale('id')
   const date = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
   let totalUsers = await sck1.countDocuments()
   let menuMessage = `
╭────《 ${fancytext(Config.ownername.split(' ')[0], 58)} 》─────⊷
│ ╭──────────────◆
│ │ User:- ${client.pushName}
│ │ Theme:- ${tlang().title}
│ │ Prefix:- [ ${prefix} ]
│ │ Owner:- ${Config.ownername}
│ │ Plugins:- ${commands.length}
│ │ Users:- ${totalUsers}
│ │ Uptime:- ${runtime(process.uptime())}
│ │ Mem:- ${formatp(os.totalmem() - os.freemem())}
│ │ Time:- ${time}
│ │ Date:- ${date}
│ ╰──────────────◆
╰───────────────⊷
${readmore}`

   for (const category in cmds) {
    menuMessage += `╭────❏ *${tiny(category)}* ❏\n`
    if (args.toLowerCase() === category.toLowerCase()) {
     menuMessage = `╭─────❏ *${tiny(category)}* ❏\n`
     for (const plugin of cmds[category]) {
      menuMessage += `│ ${fancytext(plugin, 1)}\n`
     }
     menuMessage += `╰━━━━━━━━━━━━━──⊷\n`
     break
    } else {
     for (const plugin of cmds[category]) {
      menuMessage += `│ ${fancytext(plugin, 1)}\n`
     }
     menuMessage += `╰━━━━━━━━━━━━━━──⊷\n`
    }
   }
   menuMessage += `*⭐️Type:* _${prefix}help cmd_ name to know more about a specific command.\n*Eg:* _${prefix}help attp_\n*Made with ❤️ in Node.js* `
   let buttonMessage = {
    image: { url: await botpic() },
    caption: menuMessage,
   }
   return await message.sendMessage(client.chat, buttonMessage)
  }
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'list',
  desc: 'List menu',
  category: 'general',
 },
 async (message, client) => {
  const { commands } = require('../lib')
  let listMessage = `
╭━━〘 ${fancytext(Config.ownername.split(' ')[0], 58)} 〙━━──⊷
┃ ⛥╭──────────────      
┃ ⛥│ User: ${client.pushName}
┃ ⛥│ Theme: ${tlang().title}
┃ ⛥│ Prefix: ${prefix}
┃ ⛥│ Owner: ${Config.ownername}
┃ ⛥│ Commands: ${commands.length}
┃ ⛥│ Uptime: ${runtime(process.uptime())}
┃ ⛥│ Mem: ${formatp(os.totalmem() - os.freemem())}/${formatp(os.totalmem())}
┃ ⛥│  
┃ ⛥╰───────────
╰━━━━━━━━━━━──⊷\n`
  for (let i = 0; i < commands.length; i++) {
   if (!commands[i].pattern) continue
   listMessage += `╭ ${i + 1} *${fancytext(commands[i].pattern, 1)}*\n`
   listMessage += `╰➛ ${fancytext(commands[i].desc || '', 1)}\n`
  }
  return await message.sendMessage(client.chat, { image: { url: THUMB_IMAGE }, caption: listMessage })
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'owner',
  desc: 'To find owner number',
  category: 'general',
 },
 async (message, client) => {
  const Config = require('../config')
  const ownerNumber = Config.ownerNumber[0]
  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${Config.ownername}
ORG:;
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`
  const ownerMessage = {
   contacts: { displayName: Config.ownername, contacts: [{ vcard }] },
   contextInfo: {
    externalAdReply: {
     title: Config.ownername,
     body: 'Touch here.',
     renderLargerThumbnail: true,
     thumbnailUrl: '',
     thumbnail: log0,
     mediaType: 2,
     mediaUrl: '',
     sourceUrl: `https://wa.me/+${ownerNumber}?text=Hi bro, I am ${client.pushName}`,
    },
   },
  }
  return await message.sendMessage(client.chat, ownerMessage, { quoted: client })
 }
)
