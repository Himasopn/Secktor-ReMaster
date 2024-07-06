const { Index } = require('../lib')
const Jimp = require('jimp')

Index(
 {
  pattern: 'fullpp',
  desc: 'Set full screen profile picture',
  category: 'user',
 },
 async (bot, message, args, { isCreator }) => {
  if (!isCreator) {
   return
  }

  if (!message.quoted || message.quoted.mtype !== 'imageMessage') {
   return await message.reply('_Reply to a photo_')
  }

  const imageBuffer = await message.quoted.download()
  const userId = `${bot.user.id.split(':')[0]}@s.whatsapp.net`

  try {
   await updateProfilePicture(userId, imageBuffer, bot)
   return await message.reply('_Profile Picture Updated_')
  } catch (error) {
   console.error('Error updating profile picture:', error)
   return await message.reply('_Failed to update profile picture_')
  }
 }
)

async function updateProfilePicture(userId, imageBuffer, bot) {
 const { query } = bot
 const { preview } = await generateProfilePicture(imageBuffer)

 await query({
  tag: 'iq',
  attrs: {
   to: userId,
   type: 'set',
   xmlns: 'w:profile:picture',
  },
  content: [
   {
    tag: 'picture',
    attrs: { type: 'image' },
    content: preview,
   },
  ],
 })
}

async function generateProfilePicture(imageBuffer) {
 const image = await Jimp.read(imageBuffer)
 const width = image.getWidth()
 const height = image.getHeight()
 const croppedImage = image.crop(0, 0, width, height)

 return {
  img: await croppedImage.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
  preview: await croppedImage.normalize().getBufferAsync(Jimp.MIME_JPEG),
 }
}
