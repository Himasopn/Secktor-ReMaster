const pino = require('pino')
const config = require('../config')
const fs = require('fs-extra')
const FileType = require('file-type')
const path = require('path')
const express = require('express')
const app = express()
const prefix = config.HANDLERS[0]
const mongoose = require('mongoose')
const { writeFile } = require('fs/promises')
const events = require('./commands')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const {
 default: BotConnect,
 proto,
 prepareWAMessageMedia,
 downloadContentFromMessage,
 useMultiFileAuthState,
 generateForwardMessageContent,
 generateWAMessageFromContent,
 makeInMemoryStore,
 jidDecode,
} = require('@whiskeysockets/baileys')
const util = require('util')
const Levels = require('discord-xp')
try {
 Levels.setURL(mongodb)
 console.log('🌍 Connected to Database')
} catch {
 console.log('Mongodb Connection Failed.')
 process.exit(0)
}
const { sck1, plugindb, sleep, getBuffer, tlang, clockString, fetchJson, getSizeMedia } = require('../lib')
const axios = require('axios')
const { smsg } = require('../lib/myfuncn')
global.db = JSON.parse(fs.readFileSync(__dirname + '/database.json'))
var prefixRegex = config.prefix === 'false' || config.prefix === 'null' ? '^' : new RegExp('^[' + config.HANDLERS + ']')

let sessionId = config.sessionName.replace(/session;;;/g, '')
async function MakeSession() {
 if (!fs.existsSync(__dirname + '/keys/creds.json')) {
  if (sessionId.length < 30) {
   const axios = require('axios')
   let { data } = await axios.get('https://paste.c-net.org/' + sessionId)
   await fs.writeFileSync(__dirname + '/keys/creds.json', atob(data), 'utf8')
  } else {
   var c = atob(sessionId)
   await fs.writeFileSync(__dirname + '/keys/creds.json', c, 'utf8')
  }
 }
}
MakeSession()

setTimeout(() => {
 const moment = require('moment-timezone')
 async function main() {
  if (!fs.existsSync(__dirname + '/keys/creds.json')) {
  }
  try {
   await mongoose.connect(mongodb)
  } catch {
   console.log('Could not connect with Mongodb')
  }
 }
 main()
 //========================================================================================================================================
 const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
 })
 require('events').EventEmitter.defaultMaxListeners = 600
 const getVersionWaweb = () => {
  let version
  try {
   let a = fetchJson('https://web.whatsapp.com/check-update?version=1&platform=web')
   version = [a.currentVersion.replace(/[.]/g, ', ')]
  } catch {
   version = [2, 2204, 13]
  }
  return version
 }

 async function syncdb() {
  let thumbbuffer = await getBuffer(THUMB_IMAGE)
  const ChangePic = __dirname + '/assets/SocialLogo.png'
  await writeFile(ChangePic, thumbbuffer)
  global.log0 = fs.readFileSync(__dirname + '/assets/SocialLogo.png') //ur logo pic
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/keys/')
  const client = BotConnect({
   logger: pino({ level: 'fatal' }),
   printQRInTerminal: true,
   browser: ['Chorme'],
   fireInitQueries: false,
   shouldSyncHistoryMessage: true,
   downloadHistory: true,
   syncFullHistory: true,
   generateHighQualityLinkPreview: true,
   auth: state,
   version: getVersionWaweb() || [2, 2242, 6],
   getMessage: async key => {
    if (store) {
     const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
     return msg.message || undefined
    }
    return {
     conversation: 'An Error Occurred, Repeat Command!',
    }
   },
  })
  store.bind(client.ev)
  setInterval(() => {
   store.writeToFile(__dirname + '/store.json')
  }, 30 * 1000)
  client.ev.on('messages.upsert', async chatUpdate => {
   const mek = chatUpdate.messages[0]
   if (!mek.message) return
   if (mek.message.viewOnceMessageV2) return
   mek.message = Object.keys(mek.message)[0] === 'ephemeralMessage' ? mek.message.ephemeralMessage.message : mek.message
   if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.auto_read_status === 'true') {
    await client.readMessages([mek.key])
   }
   const botNumber = await client.decodeJid(client.user.id)
   if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.auto_status_saver == true) {
    if (mek.message.extendedTextMessage) {
     let cap = mek.message.extendedTextMessage.text
     await client.sendMessage(
      botNumber,
      {
       text: cap,
      },
      {
       quoted: mek,
      }
     )
    } else if (mek.message.imageMessage) {
     let cap = mek.message.imageMessage.caption
     let anu = await client.downloadAndSaveMediaMessage(mek.message.imageMessage)
     await client.sendMessage(
      botNumber,
      {
       image: {
        url: anu,
       },
       caption: cap,
      },
      {
       quoted: mek,
      }
     )
    } else if (mek.message.videoMessage) {
     let cap = mek.message.videoMessage.caption
     let anu = await client.downloadAndSaveMediaMessage(mek.message.videoMessage)
     await client.sendMessage(
      botNumber,
      {
       video: {
        url: anu,
       },
       caption: cap,
      },
      {
       quoted: mek,
      }
     )
    }
   }

   if (mek.key && mek.key.remoteJid === 'status@broadcast') return
   try {
    let message = await smsg(client, JSON.parse(JSON.stringify(mek)), store)
    if (!message.message) return
    if (message.isBaileys) return
    if (message.chat.endsWith('broadcast')) return
    if (config.alwaysonline === 'true') {
     client.sendPresenceUpdate('available', message.chat)
    }
    var { body } = message
    var budy = typeof message.text == 'string' ? message.text : false

    if (body[1] && body[1] == ' ') body = body[0] + body.slice(2)
    let icmd = body ? prefixRegex.test(body[0]) : false
    if (config.readmessage === 'true' && icmd) {
     await client.readMessages([mek.key])
    }
    const args = message.body ? body.trim().split(/ +/).slice(1) : null
    const hgg = botNumber.split('@')[0]
    const quoted = message.quoted ? message.quoted : message
    const mime = (quoted.msg || quoted).mimetype || ''
    let creator = '2348039607375'
    if (message.chat === '120363025246125888@g.us' && message.sender !== '2348039607375@s.whatsapp.net') return
    let isCreator = [hgg, creator, ...config.owner]
     .map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
     .includes(message.sender)
    if (!isCreator && config.disablepm === 'true' && icmd && !message.isGroup) return
    if (!isCreator && config.WORKTYPE === 'private') return
    if (!isCreator) {
     let checkban =
      (await sck1.findOne({ id: message.sender })) ||
      (await sck1.updateOne({ id: message.sender }, { name: message.pushName }))
     let checkg = (await sck.findOne({ id: message.chat })) || (await new sck({ id: message.chat }).save())
     if (checkg.botenable === 'false') return
     if (icmd && checkban.ban !== 'false')
      return message.reply(
       `*Hii ${message.pushName},*\n_You are banned ❌ from using commands._\n_Please contact owner for further information._`
      )
    }
    const cmdName = icmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : false
    if (icmd) {
     const cmd =
      events.commands.find(cmd => cmd.pattern === cmdName) ||
      events.commands.find(cmd => cmd.alias && cmd.alias.includes(cmdName))
     if (cmd) {
      isCreator = [hgg, creator, ...config.owner]
       .map(v => v.replace(/[^0-9]/g) + '@s.whatsapp.net')
       .includes(message.sender)
      if (cmd.react) message.react(cmd.react)
      let text
      try {
       text = message.body ? body.trim().split(/ +/).slice(1).join(' ') : null
      } catch {
       text = false
      }
      try {
       cmd.function(client, message, text, { args, isCreator, body, budy })
      } catch (e) {
       console.error('[ERROR] ', e)
      }
     }
    }
    events.commands.map(async command => {
     if (body && command.on === 'body') {
      command.function(client, message, { args, isCreator, icmd, body, budy })
     } else if (message.text && command.on === 'text') {
      command.function(client, message, args, { isCreator, icmd, body, budy })
     } else if ((command.on === 'image' || command.on === 'photo') && message.mtype === 'imageMessage') {
      command.function(client, message, args, { isCreator, body, budy })
     } else if (command.on === 'sticker' && message.mtype === 'stickerMessage') {
      command.function(client, message, args, { isCreator, body, budy })
     }
    })
    const groupMetadata = message.isGroup ? await client.groupMetadata(message.chat).catch(e => {}) : ''
    const participants =
     message.isGroup && groupMetadata.participants != undefined ? await groupMetadata.participants : ''
    const adminsGroup = participants => {
     a = []
     for (let i of participants) {
      if (i.admin == null) continue
      a.push(i.id)
     }
     return a
    }
    const groupAdmins = message.isGroup ? await adminsGroup(participants) : ''
    const isBotAdmins = message.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = message.isGroup ? groupAdmins.includes(message.sender) : false
    if (message.isGroup) {
     console.log(`
From Group => ${groupMetadata.subject} ${message.sender}
Message: ${message.body}
`)
    }
    if (!message.isGroup) {
     console.log(`
Personal Chats
From=> ${message.pushName} ${message.sender}
Message: ${message.body} +
`)
    }
    setInterval(() => {
     fs.writeFileSync(__dirname + '/database.json', JSON.stringify(global.db, null, 2))
    }, 10000)
    try {
     let GroupS = await sck.findOne({ id: message.chat })
     if (GroupS) {
      let mongoschema = GroupS.antilink || 'false'
      let jackpot = budy.toLowerCase()
      if (message.isGroup && !isAdmins && mongoschema == 'true') {
       if (isAdmins) return
       var array = config.antilink.split(',')
       array.map(async bg => {
        let pattern = new RegExp(`\\b${bg}\\b`, 'ig')
        let chab = budy.toLowerCase()
        if (pattern.test(chab)) {
         if (!isBotAdmins) {
          let buttonMessage = {
           text: `*---  Link detected  ---*
@${message.sender.split('@')[0]} detected sending a link.
Promote ${tlang().title} as admin to kick
link senders.
`,
           mentions: [message.sender],
           headerType: 4,
          }
          client.sendMessage(message.chat, buttonMessage)
          return
         }
         let response = await client.groupInviteCode(message.chat)
         h = 'chat.whatsapp.com/' + response
         let patternn = new RegExp(`\\b${[h]}\\b`, 'ig')
         if (patternn.test(body)) {
          message.reply(`I won't remove you for sending this group link.`)
          return
         }
         const key = {
          remoteJid: message.chat,
          fromMe: false,
          id: message.id,
          participant: message.sender,
         }
         await client.sendMessage(message.chat, { delete: key })
         message.reply('Group Link Detected!!')

         try {
          await client.groupParticipantsUpdate(message.chat, [message.sender], 'remove')
         } catch {
          message.reply('*Link Detected*\n' + tlang().botAdmin)
         }
        }
       })
      }
     }
    } catch (err) {
     console.log(err)
    }
    const { chatbot } = require('../lib/')
    let checkbot = (await chatbot.findOne({ id: 'chatbot' })) || (await new chatbot({ id: 'chatbot' }).save())
    let checkon = checkbot.worktype
    if (checkon === 'true' && !icmd) {
     console.log('chatbot is on')
     if (message.key.fromMe) return
     let zx = message.text.length
     try {
      if (message.isGroup && !message.quoted && !icmd) return
      if (message.text && !message.isGroup) {
       if (zx < 25) {
        var diffuser = message.sender.split('@')[0]
        let fetchk = require('node-fetch')
        var textuser = budy
        let fetchtext = await fetchk(
         `http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${diffuser}]&msg=[${textuser}]`
        )
        let json = await fetchtext.json()
        let { cnt } = json
        message.reply(cnt)
        console.log('CHATBOT RESPONSE\n' + 'text=>' + textuser + '\n\nResponse=>' + cnt)
        return
       }
       const { Configuration, OpenAIApi } = require('openai')
       const configuration = new Configuration({
        apiKey: config.OPENAI_API_KEY || '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',
       })
       const openai = new OpenAIApi(configuration)
       const completion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: budy,
        temperature: 0.5,
        max_tokens: 80,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ['"""'],
       })
       message.reply(completion.data.choices[0].text)
      } else if (message.text && !icmd && message.isGroup && message.quoted) {
       let mention = message.mentionedJid ? message.mentionedJid[0] : message.msg.contextInfo.participant || false
       if (mention && !mention.includes(botNumber)) return
       if (zx < 20) {
        var diffuser = message.sender.split('@')[0]
        let fetchk = require('node-fetch')
        let fetchtext = await fetchk(
         `http://api.brainshop.ai/get?bid=167991&key=aozpOoNOy3dfLgmB&uid=[${diffuser}]&msg=[${message.text}]`
        )
        let json = await fetchtext.json()
        let { cnt } = json
        console.log(cnt)
        message.reply(cnt)
        return
       }
       //	if (!querie && !quoted) return citel.reply(`Hey there! ${pushname}. How are you doing these days?`);
       const { Configuration, OpenAIApi } = require('openai')
       const configuration = new Configuration({
        apiKey: config.OPENAI_API_KEY || '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',
       })
       const openai = new OpenAIApi(configuration)
       //	let textt = text ? text : citel.quoted && citel.quoted.text ? citel.quoted.text : citel.text;
       const completion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: budy,
        temperature: 0.5,
        max_tokens: 80,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ['"""'],
       })
       message.reply(completion.data.choices[0].text)
      }
      return
     } catch (err) {
      console.log(err)
     }
    }
    var array = config.antibadword.split(',')
    array.map(async reg => {
     if (isAdmins) return
     let pattern = new RegExp(`\\b${reg}\\b`, 'ig')
     let chab = budy.toLowerCase()
     if (pattern.test(chab)) {
      await new Promise(r => setTimeout(r, 1000))
      try {
       const { warndb } = require('.')
       const timesam = moment(moment()).format('HH:mm:ss')
       moment.tz.setDefault('Asia/KOLKATA').locale('id')
       await new warndb({
        id: message.sender.split('@')[0] + 'warn',
        reason: 'For using Bad Word',
        group: groupMetadata.subject,
        warnedby: tlang().title,
        date: timesam,
       }).save()
       message.reply(`
*_hey ${message.pushName}_*\n
Warning!! Bad word detected.
delete your message.
`)
       sleep(3000)
       const key = {
        remoteJid: message.chat,
        fromMe: false,
        id: message.id,
        participant: message.sender,
       }
       await client.sendMessage(message.chat, { delete: key })
      } catch (e) {
       console.log(e)
      }
     }
     return
    })
    try {
     let isNumber = x => typeof x === 'number' && !isNaN(x)
     let user = global.db.users[message.sender]
     if (typeof user !== 'object') global.db.users[message.sender] = {}
     if (user) {
      if (!isNumber(user.afkTime)) user.afkTime = -1
      if (!('afkReason' in user)) user.afkReason = ''
     } else
      global.db.users[message.sender] = {
       afkTime: -1,
       afkReason: '',
      }
     let chats = global.db.chats[message.chat]
     if (typeof chats !== 'object') global.db.chats[message.chat] = {}
     if (chats) {
      if (!('mute' in chats)) chats.mute = false
      if (!('wame' in chats)) chats.wame = false
     } else
      global.db.chats[message.chat] = {
       mute: false,
       wame: false,
      }
    } catch (err) {
     console.error(err)
    }
    //responce
    let mentionUser = [
     ...new Set([...(message.mentionedJid || []), ...(message.quoted ? [message.quoted.sender] : [])]),
    ]
    for (let jid of mentionUser) {
     let user = global.db.users[jid]
     if (!user) continue
     let afkTime = user.afkTime
     if (!afkTime || afkTime < 0) continue
     let reason = user.afkReason || ''
     reply(
      `
Hello ${message.pushName} \n\n, this is *${tlang().title}* a bot.
Don't tag him,he is busy now. But Don't worry I assure you,I'll inform him As soon as possible😉.
${reason ? 'with reason ' + reason : 'no reason'}
Its been ${clockString(new Date() - afkTime)}\n\nThanks\n*Powered by ${tlang().title}*
`.trim()
     )
    }
    if (db.users[message.sender].afkTime > -1) {
     let user = global.db.users[message.sender]
     reply(
      `
${tlang().greet} came back online from AFK${user.afkReason ? ' after ' + user.afkReason : ''}
In ${clockString(new Date() - user.afkTime)}
`.trim()
     )
     user.afkTime = -1
     user.afkReason = ''
    }
    if (isCreator && message.text.startsWith('>')) {
     let code = budy.slice(2)
     if (!code) {
      message.reply(`Provide me with a query to run Master!`)
      return
     }
     try {
      let resultTest = eval(code)
      if (typeof resultTest === 'object') message.reply(util.format(resultTest))
      else message.reply(util.format(resultTest))
     } catch (err) {
      message.reply(util.format(err))
     }
     return
    }
    if (isCreator && message.text.startsWith('$')) {
     let code = budy.slice(2)
     if (!code) {
      message.reply(`Provide me with a query to run Master!`)
      return
     }
     try {
      let resultTest = await eval('const a = async()=>{\n' + code + '\n}\na()')
      let h = util.format(resultTest)
      if (h === undefined) return console.log(h)
      else message.reply(h)
     } catch (err) {
      if (err === undefined) return console.log('error')
      else message.reply(util.format(err))
     }
     return
    }
   } catch (e) {
    console.log(e)
   }
  })
  const { sck } = require('./index.js')
  async function startcron(time, chat, type) {
   let cron = require('node-cron')
   console.log(time)
   console.log(chat)
   console.log(type)
   let [hr, min] = time.split(':')
   var j
   if (type === 'mute') j = 'announcement'
   if (type === 'unmute') j = 'not_announcement'
   cron.schedule(
    `${min} ${hr} * * *`,
    () => {
     ;(async () => {
      return await client.groupSettingUpdate(chat, j)
     })()
    },
    {
     scheduled: true,
     timezone: 'Asia/Kolkata',
    }
   )
  }
  async function foo() {
   let bar = await sck.find({})
   for (let i = 0; i < bar.length; i++) {
    if (bar[i].mute === 'false') continue
    if (bar[i].mute === undefined) continue
    await startcron(bar[i].mute, bar[i].id, 'mute')
   }
  }
  async function fooz() {
   let barz = await sck.find({})
   for (let i = 0; i < barz.length; i++) {
    if (barz[i].unmute === 'false') continue
    if (barz[i].unmute === undefined) continue
    await startcron(barz[i].unmute, barz[i].id, 'unmute')
   }
  }
  foo()
  fooz()

  if (config.autobio == true) {
   console.log('changing about')
   let cron = require('node-cron')
   cron.schedule(
    '1 * * * *',
    async () => {
     async function updateStatus() {
      const { fetchJson } = require('../lib')
      var q = '`'
      var resultt = await fetchJson(`https://api.popcat.xyz/pickuplines`)
      var textt = resultt.pickupline
      var time = moment().format('HH:mm')
      moment.tz.setDefault('Asia/Kolkata').locale('id')
      var date = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')
      var status = `${textt} \n⏰Time: ${time} \n🚀𝐒𝚵𝐂𝐊𝚻𝚯𝚪 𝚩𝚯𝚻`
      await client.updateProfileStatus(status)
     }
     await updateStatus()
    },
    {
     scheduled: true,
     timezone: 'Asia/Kolkata',
    }
   )
  }
  client.ev.on('group-participants.update', async anu => {
   try {
    let metadata = await client.groupMetadata(anu.id)
    let participants = anu.participants
    for (let num of participants) {
     var ppuser
     try {
      ppuser = await client.profilePictureUrl(num, 'image')
     } catch {
      ppuser =
       'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
     }
     if (config.antifake != '') {
      var array = config.antifake.split(',') || '92'
      for (let i = 0; i < array.length; i++) {
       let chab = require('awesome-phonenumber')('+' + num.split('@')[0]).getCountryCode()
       if (chab === array[i]) {
        console.log(array[i])
        try {
         client.sendMessage(anu.id, { text: `${chab} is not allowed` })
         return await client.groupParticipantsUpdate(anu.id, [num], 'remove')
        } catch {
         console.log('error')
        }
       }
      }
     }
     let checkinfo = await sck.findOne({ id: anu.id })
     if (checkinfo) {
      let events = checkinfo.events || 'false'
      if (anu.action == 'add' && events == 'true') {
       hesa = `${participants}`
       getnum = teks => {
        return teks.replace(/['@s whatsapp.net']/g, ' ')
       }
       resa = `${getnum(hesa)}`
       const totalmem = metadata.participants.length
       let welcome_messages = checkinfo.welcome
        .replace(/@user/gi, `@${num.split('@')[0]}`)
        .replace(/@gname/gi, metadata.subject)
        .replace(/@desc/gi, metadata.desc)
        .replace(/@count/gi, totalmem)
       if (/@pp/g.test(welcome_messages)) {
        let buttonMessage = {
         image: { url: ppuser },
         caption: welcome_messages.trim().replace(/@pp/g, ''),
         footer: `${config.botname}`,
         mentions: [num],
         headerType: 4,
        }
        return await client.sendMessage(anu.id, buttonMessage)
       } else {
        return client.sendMessage(anu.id, { text: welcome_messages.trim(), mentions: [num] })
       }
      } else if (events === 'true' && anu.action == 'remove') {
       hesa = `${participants}`
       getnum = teks => {
        return teks.replace(/['@s whatsapp.net']/g, ' ')
       }
       resa = `${getnum(hesa)}`
       const allmem = metadata.participants.length
       let goodbye_messages = checkinfo.goodbye
        .replace(/@user/gi, `@${num.split('@')[0]}`)
        .replace(/@gname/gi, metadata.subject)
        .replace(/@desc/gi, metadata.desc)
        .replace(/@count/gi, allmem)
       if (/@pp/g.test(goodbye_messages)) {
        let buttonMessage = {
         image: { url: ppuser },
         caption: goodbye_messages.trim().replace(/@pp/g, ''),
         footer: `${config.botname}`,
         mentions: [num],
         headerType: 4,
        }
        return client.sendMessage(anu.id, buttonMessage)
       } else {
        return client.sendMessage(anu.id, { text: goodbye_messages.trim(), mentions: [num] })
       }
      } else if (anu.action == 'promote') {
       var ppUrl
       try {
        ppUrl = await client.profilePictureUrl(num, 'image')
       } catch {
        ppurl = 'https://i.ibb.co/6BRf4Rc/Hans-Bot-No-Profile.png'
       }
       let buttonMessage = {
        image: { url: ppUrl },
        caption: `[ PROMOTE - DETECTED ]\n\nName : @${num.split('@')[0]}\nStatus : Member -> Admin\nGroup : ${
         metadata.subject
        }`,
        footer: `Secktor`,
        mentions: [num],
        headerType: 4,
       }
       client.sendMessage(anu.id, buttonMessage)
      } else if (anu.action == 'demote') {
       try {
        ppUrl = await client.profilePictureUrl(num, 'image')
       } catch {
        ppUrl = 'https://i.ibb.co/6BRf4Rc/Hans-Bot-No-Profile.png'
       }
       let buttonMessage = {
        image: { url: ppUrl },
        caption: `[ DEMOTE - DETECTED ]\n\nName : @${num.split('@')[0]}\nStatus : Admin -> Member`,
        footer: `Secktor`,
        mentions: [num],
        headerType: 4,
       }
       client.sendMessage(anu.id, buttonMessage)
      }
     }
    }
   } catch (err) {
    console.log(err)
   }
  })

  client.decodeJid = jid => {
   if (!jid) return jid
   if (/:\d+@/gi.test(jid)) {
    let decode = jidDecode(jid) || {}
    return (decode.user && decode.server && decode.user + '@' + decode.server) || jid
   } else return jid
  }

  client.ev.on('contacts.upsert', contacts => {
   const contactsUpsert = newContacts => {
    for (const contact of newContacts) {
     if (store.contacts[contact.id]) {
      Object.assign(store.contacts[contact.id], contact)
     } else {
      store.contacts[contact.id] = contact
     }
    }
    return
   }
   contactsUpsert(contacts)
  })

  client.ev.on('contacts.update', async update => {
   for (let contact of update) {
    let id = client.decodeJid(contact.id)
    sck1.findOne({ id: id }).then(usr => {
     if (!usr) {
      new sck1({ id: id, name: contact.notify }).save()
     } else {
      sck1.updateOne({ id: id }, { name: contact.notify })
     }
    })
    if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
   }
  })

  client.getName = (jid, withoutContact = false) => {
   id = client.decodeJid(jid)

   withoutContact = client.withoutContact || withoutContact

   let v

   if (id.endsWith('@g.us'))
    return new Promise(async resolve => {
     v = store.contacts[id] || {}

     if (!(v.name.notify || v.subject)) v = client.groupMetadata(id) || {}

     resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
    })
   else
    v =
     id === '0@s.whatsapp.net'
      ? {
         id,

         name: 'WhatsApp',
        }
      : id === client.decodeJid(client.user.id)
      ? client.user
      : store.contacts[id] || {}

   return (
    (withoutContact ? '' : v.name) ||
    v.subject ||
    v.verifiedName ||
    PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
   )
  }

  client.sendContact = async (jid, kon, quoted = '', opts = {}) => {
   let list = []
   for (let i of kon) {
    list.push({
     displayName: await client.getName(i + '@s.whatsapp.net'),
     vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(i + '@s.whatsapp.net')}\nFN:${
      global.OwnerName
     }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
      global.email
     }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
      global.github
     }/Secktor-Md\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${global.location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
    })
   }
   client.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
  }
  //========================================================================================================================================
  client.setStatus = status => {
   client.query({
    tag: 'iq',
    attrs: {
     to: '@s.whatsapp.net',
     type: 'set',
     xmlns: 'status',
    },
    content: [
     {
      tag: 'status',
      attrs: {},
      content: Buffer.from(status, 'utf-8'),
     },
    ],
   })
   return status
  }
  client.serializeM = citel => smsg(client, citel, store)
  //========================================================================================================================================
  client.ev.on('connection.update', async update => {
   const { connection, lastDisconnect } = update

   if (connection === 'connecting') {
    console.log('ℹ️ Connecting to WhatsApp... Please Wait.')
   }

   if (connection === 'open') {
    console.log('✅ Login Successful!')
    console.log('⬇️ Installing External Plugins...')

    const axios = require('axios')
    const plugins = await plugindb.find({})

    for (const plugin of plugins) {
     const response = await axios.get(plugin.url)
     const data = response.data
     await fs.writeFileSync(`${__dirname}/../commands/${plugin.id}.js`, data, 'utf8')
    }

    console.log('✅ External Plugins Installed!')

    fs.readdirSync(`${__dirname}/../commands`).forEach(plugin => {
     if (path.extname(plugin).toLowerCase() === '.js') {
      require(`${__dirname}/../commands/${plugin}`)
     }
    })

    for (const ownerId of owner) {
     const readMessageStatus = config.readmessage ? 'Read Message: ✅' : 'Read Message: ❌'
     const autoReadStatus = config.auto_read_status ? 'Auto Read Status: ✅' : 'Auto Read Status: ❌'
     const disablePmStatus = config.disablepm ? 'Disable PM: ✅' : 'Disable PM: ❌'
     const openAiKeyStatus = config.OPENAI_API_KEY ? 'OPENAI KEY: ✅' : 'OPENAI KEY: ❌'
     const levelUpMessageStatus = config.levelupmessage ? 'Level Up Message: ✅' : 'Level Up Message: ❌'
     const autoReactionStatus = config.autoreaction ? 'Auto Reaction: ✅' : 'Auto Reaction: ❌'

     const message = `
          _Secktor has been integrated._
          _Total Plugins : ${events.commands.length}_
          _Mode: ${config.WORKTYPE}_
          _Version: 0.0.5_
          _Branch: ${config.BRANCH}_
          _Theme: ${config.LANG}_
          _Prefix: ${prefix}_
          _Owner: ${process.env.OWNER_NAME}_
  
          *Extra Configurations:*
          ${readMessageStatus}
          ${autoReadStatus}
          ${disablePmStatus}
          ${openAiKeyStatus}
          ${levelUpMessageStatus}
          ${autoReactionStatus}
        `

     Void.sendMessage(`${ownerId}@s.whatsapp.net`, { text: message })
    }
   }

   if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
    console.log('Connection closed with bot. Please put New Session ID again.')
    await sleep(50000)
    syncdb().catch(err => console.log(err))
   }
  })

  client.ev.on('creds.update', saveCreds)
  //================================================[Some Params]===============================================================================
  /** Send Button 5 Image
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} footer
   * @param {*} image
   * @param [*] button
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.send5ButImg = async (jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
   let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: client.waUploadToServer })
   var template = generateWAMessageFromContent(
    jid,
    proto.Message.fromObject({
     templateMessage: {
      hydratedTemplate: {
       imageMessage: message.imageMessage,
       hydratedContentText: text,
       hydratedFooterText: footer,
       hydratedButtons: but,
      },
     },
    }),
    options
   )
   client.relayMessage(jid, template.message, { messageId: template.key.id })
  }

  /**
   *
   * @param {*} jid
   * @param {*} buttons
   * @param {*} caption
   * @param {*} footer
   * @param {*} quoted
   * @param {*} options
   */
  //========================================================================================================================================
  client.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
   let buttonMessage = {
    text,
    footer,
    buttons,
    headerType: 2,
    ...options,
   }
   //========================================================================================================================================
   client.sendMessage(jid, buttonMessage, { quoted, ...options })
  }

  /**
   *
   * @param {*} jid
   * @param {*} text
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.sendText = (jid, text, quoted = '', options) => client.sendMessage(jid, { text: text, ...options }, { quoted })

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.sendImage = async (jid, path, caption = '', quoted = '', options) => {
   let buffer = Buffer.isBuffer(path)
    ? path
    : /^data:.*?\/.*?;base64,/i.test(path)
    ? Buffer.from(path.split`,`[1], 'base64')
    : /^https?:\/\//.test(path)
    ? await await getBuffer(path)
    : fs.existsSync(path)
    ? fs.readFileSync(path)
    : Buffer.alloc(0)
   return await client.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
  }

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} caption
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
   client.sendMessage(
    jid,
    {
     text: text,
     contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') },
     ...options,
    },
    { quoted }
   )

  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.sendImageAsSticker = async (jid, buff, options = {}) => {
   let buffer
   if (options && (options.packname || options.author)) {
    buffer = await writeExifImg(buff, options)
   } else {
    buffer = await imageToWebp(buff)
   }
   await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, options)
  }
  /**
   *
   * @param {*} jid
   * @param {*} path
   * @param {*} quoted
   * @param {*} options
   * @returns
   */
  client.sendVideoAsSticker = async (jid, buff, options = {}) => {
   let buffer
   if (options && (options.packname || options.author)) {
    buffer = await writeExifVid(buff, options)
   } else {
    buffer = await videoToWebp(buff)
   }
   await client.sendMessage(jid, { sticker: { url: buffer }, ...options }, options)
  }

  //========================================================================================================================================
  client.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
   let types = await client.getFile(path, true)
   let { mime, ext, res, data, filename } = types
   if ((res && res.status !== 200) || file.length <= 65536) {
    try {
     throw { json: JSON.parse(file.toString()) }
    } catch (e) {
     if (e.json) throw e.json
    }
   }
   let type = '',
    mimetype = mime,
    pathFile = filename
   if (options.asDocument) type = 'document'
   if (options.asSticker || /webp/.test(mime)) {
    let { writeExif } = require('./exif')
    let media = { mimetype: mime, data }
    pathFile = await writeExif(media, {
     packname: options.packname ? options.packname : config.packname,
     author: options.author ? options.author : config.author,
     categories: options.categories ? options.categories : [],
    })
    await fs.promises.unlink(filename)
    type = 'sticker'
    mimetype = 'image/webp'
   } else if (/image/.test(mime)) type = 'image'
   else if (/video/.test(mime)) type = 'video'
   else if (/audio/.test(mime)) type = 'audio'
   else type = 'document'
   await client.sendMessage(
    jid,
    {
     [type]: { url: pathFile },
     caption,
     mimetype,
     fileName,
     ...options,
    },
    { quoted, ...options }
   )
   return fs.promises.unlink(pathFile)
  }
  /**
   *
   * @param {*} message
   * @param {*} filename
   * @param {*} attachExtension
   * @returns
   */
  //========================================================================================================================================
  client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
   let quoted = message.msg ? message.msg : message
   let mime = (message.msg || message).mimetype || ''
   let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
   const stream = await downloadContentFromMessage(quoted, messageType)
   let buffer = Buffer.from([])
   for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
   }
   let type = await FileType.fromBuffer(buffer)
   trueFileName = attachExtension ? filename + '.' + type.ext : filename
   // save to file
   await fs.writeFileSync(trueFileName, buffer)
   return trueFileName
  }
  //========================================================================================================================================
  client.downloadMediaMessage = async message => {
   let mime = (message.msg || message).mimetype || ''
   let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
   const stream = await downloadContentFromMessage(message, messageType)
   let buffer = Buffer.from([])
   for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])
   }

   return buffer
  }

  /**
   *
   * @param {*} jid
   * @param {*} message
   * @param {*} forceForward
   * @param {*} options
   * @returns
   */
  //========================================================================================================================================
  client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
   let vtype
   if (options.readViewOnce) {
    message.message =
     message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message
      ? message.message.ephemeralMessage.message
      : message.message || undefined
    vtype = Object.keys(message.message.viewOnceMessage.message)[0]
    delete (message.message && message.message.ignore ? message.message.ignore : message.message || undefined)
    delete message.message.viewOnceMessage.message[vtype].viewOnce
    message.message = {
     ...message.message.viewOnceMessage.message,
    }
   }

   let mtype = Object.keys(message.message)[0]
   let content = await generateForwardMessageContent(message, forceForward)
   let ctype = Object.keys(content)[0]
   let context = {}
   if (mtype != 'conversation') context = message.message[mtype].contextInfo
   content[ctype].contextInfo = {
    ...context,
    ...content[ctype].contextInfo,
   }
   const waMessage = await generateWAMessageFromContent(
    jid,
    content,
    options
     ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo
         ? {
            contextInfo: {
             ...content[ctype].contextInfo,
             ...options.contextInfo,
            },
           }
         : {}),
       }
     : {}
   )
   await client.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
   return waMessage
  }
  client.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
   let mime = ''
   let res = await axios.head(url)
   mime = res.headers['content-type']
   if (mime.split('/')[1] === 'gif') {
    return client.sendMessage(
     jid,
     { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options },
     { quoted: quoted, ...options }
    )
   }
   let type = mime.split('/')[0] + 'Message'
   if (mime === 'application/pdf') {
    return client.sendMessage(
     jid,
     { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options },
     { quoted: quoted, ...options }
    )
   }
   if (mime.split('/')[0] === 'image') {
    return client.sendMessage(
     jid,
     { image: await getBuffer(url), caption: caption, ...options },
     { quoted: quoted, ...options }
    )
   }
   if (mime.split('/')[0] === 'video') {
    return client.sendMessage(
     jid,
     { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options },
     { quoted: quoted, ...options }
    )
   }
   if (mime.split('/')[0] === 'audio') {
    return client.sendMessage(
     jid,
     { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options },
     { quoted: quoted, ...options }
    )
   }
  }

  //========================================================================================================================================
  client.cMod = (jid, copy, text = '', sender = client.user.id, options = {}) => {
   let mtype = Object.keys(copy.message)[0]
   let isEphemeral = mtype === 'ephemeralMessage'
   if (isEphemeral) {
    mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
   }
   let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
   let content = msg[mtype]
   if (typeof content === 'string') msg[mtype] = text || content
   else if (content.caption) content.caption = text || content.caption
   else if (content.text) content.text = text || content.text
   if (typeof content !== 'string')
    msg[mtype] = {
     ...content,
     ...options,
    }
   if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
   else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
   if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
   else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
   copy.key.remoteJid = jid
   copy.key.fromMe = sender === client.user.id

   return proto.WebMessageInfo.fromObject(copy)
  }

  /**
   *
   * @param {*} path
   * @returns
   */
  //========================================================================================================================================
  client.getFile = async (PATH, save) => {
   let res
   let data = Buffer.isBuffer(PATH)
    ? PATH
    : /^data:.*?\/.*?;base64,/i.test(PATH)
    ? Buffer.from(PATH.split`,`[1], 'base64')
    : /^https?:\/\//.test(PATH)
    ? await (res = await getBuffer(PATH))
    : fs.existsSync(PATH)
    ? ((filename = PATH), fs.readFileSync(PATH))
    : typeof PATH === 'string'
    ? PATH
    : Buffer.alloc(0)
   //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
   let type = (await FileType.fromBuffer(data)) || {
    mime: 'application/octet-stream',
    ext: '.bin',
   }
   let filename = path.join(__filename, __dirname + new Date() * 1 + '.' + type.ext)
   if (data && save) fs.promises.writeFile(filename, data)
   return {
    res,
    filename,
    size: await getSizeMedia(data),
    ...type,
    data,
   }
  }
  //========================================================================================================================================
  client.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
   let types = await client.getFile(PATH, true)
   let { filename, size, ext, mime, data } = types
   let type = '',
    mimetype = mime,
    pathFile = filename
   if (options.asDocument) type = 'document'
   if (options.asSticker || /webp/.test(mime)) {
    let { writeExif } = require('./exif.js')
    let media = { mimetype: mime, data }
    pathFile = await writeExif(media, {
     packname: config.packname,
     author: config.packname,
     categories: options.categories ? options.categories : [],
    })
    await fs.promises.unlink(filename)
    type = 'sticker'
    mimetype = 'image/webp'
   } else if (/image/.test(mime)) type = 'image'
   else if (/video/.test(mime)) type = 'video'
   else if (/audio/.test(mime)) type = 'audio'
   else type = 'document'
   await client.sendMessage(
    jid,
    {
     [type]: { url: pathFile },
     mimetype,
     fileName,
     ...options,
    },
    { quoted, ...options }
   )
   return fs.promises.unlink(pathFile)
  }
  //========================================================================================================================================
  client.parseMention = async text => {
   return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  }

  return client
 }
 syncdb().catch(err => console.log(err))

 const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Secktor-Md</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from AstroFx0011!
    </section>
  </body>
</html>
`
 app.get('/', (req, res) => res.type('html').send(html))
 app.listen(port, () => console.log(`Secktor Server listening on port http://localhost:${port}!`))
 //=============================[to get message of New Update of this file.]===================================================
 let file = require.resolve(__filename)
 fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update ${__filename}`)
  delete require.cache[file]
  require(file)
 })
}, 3000)

function atob(str) {
 return Buffer.from(str, 'base64').toString('binary')
}
