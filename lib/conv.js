const ffmpeg = require('fluent-ffmpeg')
const { randomBytes } = require('crypto')
const fs = require('fs').promises
const { isUrl } = require('./index')
const { getHttpStream, toBuffer } = require('@whiskeysockets/baileys')
const sharp = require('sharp')
const { spawn } = require('child_process')
const { fromBuffer } = require('file-type')

const generateRandomPath = extension => `./${randomBytes(3).toString('hex')}.${extension}`

const saveBuffer = async (buffer, path) => {
 try {
  await fs.writeFile(path, buffer)
  return path
 } catch (error) {
  console.error('Error saving buffer:', error)
  throw error
 }
}

const toGif = async data => {
 const input = generateRandomPath('webp')
 const output = generateRandomPath('gif')

 try {
  await fs.writeFile(input, data)

  await new Promise((resolve, reject) => {
   spawn('convert', [input, output])
    .on('error', reject)
    .on('exit', () => resolve())
  })

  const result = await fs.readFile(output)
  await Promise.all([fs.unlink(input), fs.unlink(output)])
  return result
 } catch (error) {
  console.error('Error converting to GIF:', error)
  throw error
 }
}

const toMp4 = async data => {
 const input = generateRandomPath('gif')
 const output = generateRandomPath('mp4')

 try {
  const inputPath = fs.existsSync(data) ? data : await saveBuffer(data, input)

  await new Promise((resolve, reject) => {
   ffmpeg(inputPath)
    .outputOptions([
     '-pix_fmt yuv420p',
     '-c:v libx264',
     '-movflags +faststart',
     "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'",
    ])
    .toFormat('mp4')
    .noAudio()
    .save(output)
    .on('end', resolve)
    .on('error', reject)
  })

  const result = await fs.readFile(output)
  await Promise.all([fs.unlink(input), fs.unlink(output)])
  return result
 } catch (error) {
  console.error('Error converting to MP4:', error)
  throw error
 }
}

const toAudio = async data => {
 try {
  const get = await toBuffer(await getHttpStream(data))
  const { ext } = await fromBuffer(get)
  const input = generateRandomPath(ext)
  const output = generateRandomPath('mp3')

  const inputPath = Buffer.isBuffer(data)
   ? await saveBuffer(data, input)
   : fs.existsSync(data)
   ? data
   : isUrl(data)
   ? await saveBuffer(get, input)
   : data

  await new Promise((resolve, reject) => {
   ffmpeg(inputPath)
    .audioFrequency(44100)
    .audioChannels(2)
    .audioBitrate('128k')
    .audioCodec('libmp3lame')
    .audioQuality(5)
    .toFormat('mp3')
    .save(output)
    .on('end', resolve)
    .on('error', reject)
  })

  return output
 } catch (error) {
  console.error('Error converting to audio:', error)
  throw error
 }
}

const EightD = async input => {
 const inputPath = generateRandomPath('mp3')
 const output = generateRandomPath('mp3')

 try {
  if (Buffer.isBuffer(input)) {
   await saveBuffer(input, inputPath)
  } else {
   inputPath = input
  }

  await new Promise((resolve, reject) => {
   ffmpeg(inputPath)
    .audioFilter(['apulsator=hz=0.125'])
    .audioFrequency(44100)
    .audioChannels(2)
    .audioBitrate('128k')
    .audioCodec('libmp3lame')
    .audioQuality(5)
    .toFormat('mp3')
    .save(output)
    .on('end', resolve)
    .on('error', reject)
  })

  return output
 } catch (error) {
  console.error('Error creating 8D audio:', error)
  throw error
 }
}

const resizeImage = async (buffer, width, height) => {
 if (!Buffer.isBuffer(buffer)) throw new Error('Input is not a Buffer')
 try {
  return await sharp(buffer).resize(width, height, { fit: 'contain' }).toBuffer()
 } catch (error) {
  console.error('Error resizing image:', error)
  throw error
 }
}

const parseInput = async (data, attachExtension, result = 'path') => {
 try {
  const get = await toBuffer(await getHttpStream(data))
  const { ext } = await fromBuffer(get)
  const inputPath = generateRandomPath(attachExtension || ext)

  const out = Buffer.isBuffer(data)
   ? await saveBuffer(data, inputPath)
   : fs.existsSync(data)
   ? data
   : isUrl(data)
   ? await saveBuffer(get, inputPath)
   : data

  if (result === 'path') {
   return out
  } else if (result === 'buffer') {
   const buff = await fs.readFile(out)
   await fs.unlink(out)
   return buff
  }
 } catch (error) {
  console.error('Error parsing input:', error)
  throw error
 }
}

module.exports = {
 toGif,
 toMp4,
 toAudio,
 EightD,
 parseInput,
 resizeImage,
}
