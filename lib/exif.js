const fs = require('fs').promises
const { tmpdir } = require('os')
const crypto = require('crypto')
const ffmpeg = require('fluent-ffmpeg')
const webp = require('node-webpmux')
const path = require('path')

const generateTempPath = extension =>
 path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${extension}`)

const ffmpegPromise = (inputPath, outputPath, options) => {
 return new Promise((resolve, reject) => {
  ffmpeg(inputPath)
   .outputOptions(options)
   .on('error', reject)
   .on('end', () => resolve(true))
   .save(outputPath)
 })
}

const convertToWebp = async (media, isVideo = false) => {
 const tmpFileIn = generateTempPath(isVideo ? 'mp4' : 'jpg')
 const tmpFileOut = generateTempPath('webp')

 await fs.writeFile(tmpFileIn, media)

 const ffmpegOptions = [
  '-vcodec',
  'libwebp',
  '-vf',
  "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
 ]

 if (isVideo) {
  ffmpegOptions.push('-loop', '0', '-ss', '00:00:00', '-t', '00:00:05', '-preset', 'default', '-an', '-vsync', '0')
 }

 await ffmpegPromise(tmpFileIn, tmpFileOut, ffmpegOptions)

 const buff = await fs.readFile(tmpFileOut)
 await Promise.all([fs.unlink(tmpFileOut), fs.unlink(tmpFileIn)])
 return buff
}

const writeExif = async (media, metadata, mediaType) => {
 const tmpFileIn = generateTempPath('webp')
 const tmpFileOut = generateTempPath('webp')

 let wMedia
 if (mediaType === 'webp') {
  wMedia = media
 } else {
  wMedia = await convertToWebp(media, mediaType === 'video')
 }

 await fs.writeFile(tmpFileIn, wMedia)

 if (metadata.packname || metadata.author) {
  const img = new webp.Image()
  const json = {
   'sticker-pack-id': `Secktor-AstroFx0011`,
   'sticker-pack-name': metadata.packname,
   'sticker-pack-publisher': metadata.author,
   emojis: metadata.categories || [''],
  }
  const exifAttr = Buffer.from([
   0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16,
   0x00, 0x00, 0x00,
  ])
  const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8')
  const exif = Buffer.concat([exifAttr, jsonBuff])
  exif.writeUIntLE(jsonBuff.length, 14, 4)
  await img.load(tmpFileIn)
  await fs.unlink(tmpFileIn)
  img.exif = exif
  await img.save(tmpFileOut)
  return tmpFileOut
 }
}

module.exports = {
 imageToWebp: media => convertToWebp(media, false),
 videoToWebp: media => convertToWebp(media, true),
 writeExifImg: (media, metadata) => writeExif(media, metadata, 'image'),
 writeExifVid: (media, metadata) => writeExif(media, metadata, 'video'),
 writeExifWebp: (media, metadata) => writeExif(media, metadata, 'webp'),
}
