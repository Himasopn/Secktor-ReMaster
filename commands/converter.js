const axios = require('axios')
const fs = require('fs-extra')
const { exec } = require('child_process')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const { sck1, tiny, fancytext, listall, Index } = require('../lib')
const Config = require('../config')

// Utility function to get a random file name
const getRandomFileName = ext => `${Math.floor(Math.random() * 10000)}${ext}`

// Function to delete file
const deleteFile = (path, description) => {
 fs.unlink(path, err => {
  if (err) {
   console.error(`File Not Deleted from ${description} at: ${path}\nError:`, err)
  } else {
   console.log(`File deleted successfully in ${description} at: ${path}`)
  }
 })
}

// Command to convert sticker to photo
Index(
 {
  pattern: 'photo',
  desc: 'Converts replied sticker to photo.',
  category: 'converter',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply(`_Reply to any sticker._`)
  const mime = citel.quoted.mtype
  if (mime === 'imageMessage' || mime === 'stickerMessage') {
   const media = await Void.downloadAndSaveMediaMessage(citel.quoted)
   const name = getRandomFileName('.png')
   exec(`ffmpeg -i ${media} ${name}`, () => {
    const buffer = fs.readFileSync(media)
    Void.sendMessage(citel.chat, { image: buffer }, { quoted: citel })
    deleteFile(media, 'TOPHOTO')
   })
  } else {
   citel.reply('Please reply to a non-animated sticker.')
  }
 }
)

// Command to flip given text
Index(
 {
  pattern: 'vv',
  desc: 'Flips given text.',
  category: 'misc',
 },
 async (Void, citel) => {
  try {
   const quot = citel.msg.contextInfo.quotedMessage.viewOnceMessageV2
   if (quot) {
    const cap = quot.message?.imageMessage?.caption || quot.message?.videoMessage?.caption
    const mediaType = quot.message?.imageMessage ? 'image' : 'video'
    if (cap && mediaType) {
     const media = await Void.downloadAndSaveMediaMessage(quot.message[mediaType])
     return Void.sendMessage(citel.chat, { [mediaType]: { url: media }, caption: cap })
    }
   }
  } catch (e) {
   console.log('Error:', e)
  }

  if (!citel.quoted) return citel.reply('Please reply to a ViewOnce message.')
  const mime = citel.quoted.mtype
  if (mime === 'viewOnceMessage') {
   const cap = citel.quoted.message?.imageMessage?.caption || citel.quoted.message?.videoMessage?.caption
   const mediaType = citel.quoted.message?.imageMessage ? 'image' : 'video'
   if (cap && mediaType) {
    const media = await Void.downloadAndSaveMediaMessage(citel.quoted.message[mediaType])
    return Void.sendMessage(citel.chat, { [mediaType]: { url: media }, caption: cap })
   }
  } else {
   citel.reply('This is not a ViewOnce message.')
  }
 }
)

// Command to make a sticker of quoted text
Index(
 {
  pattern: 'quotely',
  desc: 'Makes a sticker of quoted text.',
  category: 'converter',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply('Please quote/reply to any message.')
  const text = citel.quoted.text
  let pfp
  try {
   pfp = await Void.profilePictureUrl(citel.quoted.sender, 'image')
  } catch (e) {
   pfp = Config.THUMB_IMAGE
  }

  const username = await sck1.findOne({ id: citel.quoted.sender })
  const tname = username?.name || (await Void.getName(citel.quoted.sender))
  const body = {
   type: 'quote',
   format: 'png',
   backgroundColor: '#FFFFFF',
   width: 512,
   height: 512,
   scale: 3,
   messages: [
    {
     avatar: true,
     from: { first_name: tname, name: tname, photo: { url: pfp } },
     text: text,
     replyMessage: {},
    },
   ],
  }

  try {
   const res = await axios.post('https://bot.lyo.su/quote/generate', body)
   const img = Buffer.from(res.data.result.image, 'base64')
   return citel.reply(img, { packname: 'Secktor', author: 'Quotely' }, 'sticker')
  } catch (e) {
   citel.reply('Failed to generate quote sticker.')
   console.log('Error:', e)
  }
 }
)

// Command to make stylish/fancy given text
Index(
 {
  pattern: 'fancy',
  desc: 'Makes stylish/fancy given text.',
  category: 'converter',
 },
 async (Void, citel, text) => {
  if (isNaN(text.split(' ')[0]) || !text) {
   let responseText = tiny('Fancy text generator\n\nExample: .fancy 32 Secktor\n\n')
   listall('Secktor Bot').forEach((txt, num) => {
    responseText += `${num + 1} ${txt}\n`
   })
   return citel.reply(responseText)
  }

  const fancyText = await fancytext(text.slice(2), text.split(' ')[0])
  citel.reply(fancyText)
 }
)

// Command to make URL tiny
Index(
 {
  pattern: 'tiny',
  desc: 'Makes URL tiny.',
  category: 'converter',
 },
 async (Void, citel, text) => {
  if (!text) return citel.reply('Provide me a link.')
  try {
   const link = text.split(' ')[0]
   const response = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`)
   citel.reply(`*🛡️ Your Shortened URL*\n\n${response.data}`)
  } catch (e) {
   citel.reply('Failed to shorten the URL.')
   console.log('Error:', e)
  }
 }
)

// Command to make sticker of replied image/video in circle format
Index(
 {
  pattern: 'circle',
  desc: 'Makes sticker of replied image/video in circle format.',
  category: 'sticker',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply('Reply to any image or video.')
  const mime = citel.quoted.mtype
  if (mime === 'imageMessage' || mime === 'stickerMessage') {
   const media = await citel.quoted.download()
   const sticker = new Sticker(media, {
    pack: Config.packname,
    author: Config.author,
    type: StickerTypes.CIRCLE,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 75,
   })
   const buffer = await sticker.toBuffer()
   return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel })
  } else {
   citel.reply('Please reply to an image.')
  }
 }
)

// Command to make cropped sticker of replied image/video
Index(
 {
  pattern: 'crop',
  desc: 'Makes sticker of replied image/video.',
  category: 'sticker',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply('Reply to any image or video.')
  const mime = citel.quoted.mtype
  if (mime === 'imageMessage' || mime === 'stickerMessage') {
   const media = await citel.quoted.download()
   const sticker = new Sticker(media, {
    pack: Config.packname,
    author: Config.author,
    type: StickerTypes.CROPPED,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 75,
   })
   const buffer = await sticker.toBuffer()
   return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel })
  } else {
   citel.reply('Please reply to an image.')
  }
 }
)

// Command to make rounded sticker of replied image/video
Index(
 {
  pattern: 'round',
  desc: 'Makes sticker of replied image/video in rounded format.',
  category: 'sticker',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply('Reply to any image or video.')
  const mime = citel.quoted.mtype
  if (mime === 'imageMessage' || mime === 'stickerMessage') {
   const media = await citel.quoted.download()
   const sticker = new Sticker(media, {
    pack: Config.packname,
    author: Config.author,
    type: StickerTypes.ROUNDED,
    categories: ['🤩', '🎉'],
    id: '12345',
    quality: 75,
   })
   const buffer = await sticker.toBuffer()
   return Void.sendMessage(citel.chat, { sticker: buffer }, { quoted: citel })
  } else {
   citel.reply('Please reply to an image.')
  }
 }
)

// Command to convert video to audio
Index(
 {
  pattern: 'toaudio',
  desc: 'Converts video to audio.',
  category: 'converter',
 },
 async (Void, citel) => {
  if (!citel.quoted) return citel.reply('Reply to any video.')
  const mime = citel.quoted.mtype
  if (mime === 'audioMessage' || mime === 'videoMessage') {
   const media = await Void.downloadAndSaveMediaMessage(citel.quoted)
   const { toAudio } = require('../lib')
   const buffer = fs.readFileSync(media)
   const audio = await toAudio(buffer)
   Void.sendMessage(citel.chat, { audio: audio, mimetype: 'audio/mpeg' }, { quoted: citel })
   deleteFile(media, 'TOAUDIO')
  } else {
   citel.reply('Please reply to a video message.')
  }
 }
)
