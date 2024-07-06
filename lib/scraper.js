const axios = require('axios')
const fs = require('fs-extra')
const path = require('path')
const cheerio = require('cheerio')
const { spawn } = require('child_process')
let BodyForm = require('form-data')

function pinterest(querry) {
 return new Promise(async (resolve, reject) => {
  axios
   .get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
    headers: {
     cookie:
      '_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0',
    },
   })
   .then(({ data }) => {
    const $ = cheerio.load(data)
    const result = []
    const hasil = []
    $('div > a')
     .get()
     .map(b => {
      const link = $(b).find('img').attr('src')
      result.push(link)
     })
    result.forEach(v => {
     if (v == undefined) return
     hasil.push(v.replace(/236/g, '736'))
    })
    hasil.shift()
    resolve(hasil)
   })
 })
}

function wallpaper(title, page = '1') {
 return new Promise((resolve, reject) => {
  axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`).then(({ data }) => {
   let $ = cheerio.load(data)
   let hasil = []
   $('div.grid-item').each(function (a, b) {
    hasil.push({
     title: $(b).find('div.info > a > h3').text(),
     type: $(b).find('div.info > a:nth-child(2)').text(),
     source: 'https://www.besthdwallpaper.com/' + $(b).find('div > a:nth-child(3)').attr('href'),
     image: [
      $(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'),
      $(b).find('picture > source:nth-child(1)').attr('srcset'),
      $(b).find('picture > source:nth-child(2)').attr('srcset'),
     ],
    })
   })
   resolve(hasil)
  })
 })
}

function TelegraPh(Path) {
 return new Promise(async (resolve, reject) => {
  if (!fs.existsSync(Path)) return reject(new Error('File not Found'))
  try {
   const form = new BodyForm()
   form.append('file', fs.createReadStream(Path))
   const data = await axios({
    url: 'https://telegra.ph/upload',
    method: 'POST',
    headers: {
     ...form.getHeaders(),
    },
    data: form,
   })
   return resolve('https://telegra.ph' + data.data[0].src)
  } catch (err) {
   return reject(new Error(String(err)))
  }
 })
}

async function uploadFile(input) {
 return new Promise(async (resolve, reject) => {
  const form = new BodyForm()
  form.append('files[]', fs.createReadStream(input))
  await axios({
   url: 'https://uguu.se/upload.php',
   method: 'POST',
   headers: {
    'User-Agent':
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    ...form.getHeaders(),
   },
   data: form,
  })
   .then(data => {
    resolve(data.data.files[0])
   })
   .catch(err => reject(err))
 })
}

function webp2mp4File(path) {
 return new Promise((resolve, reject) => {
  const form = new BodyForm()
  form.append('new-image-url', '')
  form.append('new-image', fs.createReadStream(path))
  axios({
   method: 'post',
   url: 'https://s6.ezgif.com/webp-to-mp4',
   data: form,
   headers: {
    'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
   },
  })
   .then(({ data }) => {
    const bodyFormThen = new BodyForm()
    const $ = cheerio.load(data)
    const file = $('input[name="file"]').attr('value')
    bodyFormThen.append('file', file)
    bodyFormThen.append('convert', 'Convert WebP to MP4!')
    axios({
     method: 'post',
     url: 'https://ezgif.com/webp-to-mp4/' + file,
     data: bodyFormThen,
     headers: {
      'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`,
     },
    })
     .then(({ data }) => {
      const $ = cheerio.load(data)
      const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
      resolve({
       status: true,
       message: 'Created By Secktor Botto',
       result: result,
      })
     })
     .catch(reject)
   })
   .catch(reject)
 })
}

function wikimedia(title) {
 return new Promise((resolve, reject) => {
  axios
   .get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
   .then(res => {
    let $ = cheerio.load(res.data)
    let hasil = []
    $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
     hasil.push({
      title: $(b).find('img').attr('alt'),
      source: $(b).attr('href'),
      image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src'),
     })
    })
    resolve(hasil)
   })
 })
}
function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
 return new Promise(async (resolve, reject) => {
  try {
   let tmp = path.join(__dirname, './', +new Date() + '.' + ext)
   let out = tmp + '.' + ext2
   await fs.promises.writeFile(tmp, buffer)
   spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
    .on('error', reject)
    .on('close', async code => {
     try {
      await fs.promises.unlink(tmp)
      if (code !== 0) return reject(code)
      resolve(await fs.promises.readFile(out))
      await fs.promises.unlink(out)
     } catch (e) {
      reject(e)
     }
    })
  } catch (e) {
   reject(e)
  }
 })
}
/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toAudio(buffer, ext) {
 return ffmpeg(buffer, ['-vn', '-ac', '2', '-b:a', '128k', '-ar', '44100', '-f', 'mp3'], ext, 'mp3')
}
/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension
 */
function toPTT(buffer, ext) {
 return ffmpeg(
  buffer,
  ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'],
  ext,
  'opus'
 )
}
/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension
 */
function toVideo(buffer, ext) {
 return ffmpeg(
  buffer,
  ['-c:v', 'libx264', '-c:a', 'aac', '-ab', '128k', '-ar', '44100', '-crf', '32', '-preset', 'slow'],
  ext,
  'mp4'
 )
}

const Config = require('../config')
if (fs.existsSync('./db/' + Config.LANG + '.json')) {
 var json = JSON.parse(fs.readFileSync('./db/' + Config.LANG + '.json'))
} else {
 var json = JSON.parse(fs.readFileSync('./db/SECKTOR.json'))
}
function ffancy(teks) {
 return new Promise((resolve, reject) => {
  axios.get('http://qaz.wtf/u/convert.cgi?text=' + teks).then(({ data }) => {
   let $ = cheerio.load(data)
   let hasil = []
   $('table > tbody > tr').each(function (a, b) {
    hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
   })
   resolve(hasil)
  })
 })
}

async function fancy(teks, num) {
 try {
  let huhh = await ffancy(teks)
  return huhh[num].result
 } catch (e) {
  console.log(e)
 }
}
async function randomfancy(teks, num) {
 try {
  let huhh = await ffancy(teks)
  return huhh[num].result
 } catch (e) {
  console.log(e)
 }
}
function getString(file) {
 return json['STRINGS'][file]
}
function tlang() {
 let LangG = getString('global')
 return LangG
}
function botpic() {
 return new Promise((resolve, reject) => {
  let LangG = getString('global')
  let todlink = [`${LangG.pic1}`, `${LangG.pic2}`, `${LangG.pic3}`, `${LangG.pic4}`, `${LangG.pic5}`, `${LangG.pic6}`]
  const picsecktorh = todlink[Math.floor(Math.random() * todlink.length)]
  resolve(picsecktorh)
 })
}
async function checkcard(id) {
 let cdata = await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
 return cdata.data.data[0]
}
async function updatedb() {
 const simpleGit = require('simple-git')
 const git = simpleGit()
 const Heroku = require('heroku-client')
 const heroku = new Heroku({ token: process.env.HEROKU_API_KEY })
 await git.fetch()
 var commits = await git.log(['main' + '..origin/' + 'main'])
 if (commits.total === 0) {
  return 'ʏᴏᴜ..ʜᴀᴠᴇ...ᴀʟʀᴇᴅʏ..ᴜᴘᴅᴀᴛᴇᴅ...'
 } else {
  var app = await heroku.get('/apps/' + process.env.HEROKU_APP_NAME)
  //   await Void.sendMessage(citel.chat,{text:'*ᴜᴘᴅᴀᴛɪɴɢ...*'})
  git.fetch('upstream', 'main')
  git.reset('hard', ['FETCH_HEAD'])

  var git_url = app.git_url.replace('https://', 'https://api:' + process.env.HEROKU_API_KEY + '@')
  try {
   await git.addRemote('heroku', git_url)
  } catch {
   console.log('heroku remote adding error')
  }
  await git.push('heroku', 'main')

  return '*ʙᴏᴛ ᴜᴘᴅᴀᴛᴇᴅ...*\n_Restarting._'
 }
}
async function claim(id, user) {
 let cdata = await axios.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
 let data = cdata.data.data[0]
 const { card } = require('.')
 await new card({
  user: user,
  id: data.id,
  name: data.name,
  desc: data.desc,
  atk: data.atk,
  def: data.def,
  race: data.race,
  image: data.card_images[0].image_url,
  price: data.card_prices[0].amazon_price * 1000,
 }).save()
 return cdata.data.data[0]
}
async function collection(h) {
 const { card } = require('.')
 let getGroups = await card.find().where('user').in(h)
 return getGroups
}
async function install(h) {
 let huh = require('fs')
 let AxiosData = await axios.get(h)
 let data = AxiosData.data
 let fname = await huh.writeFileSync(__dirname + '/../commands/System/1.js', data, 'utf8')
 console.log('fname ' + fname)
 const command = require(__dirname + '/../commands/System/1.js', data, 'utf8')
 console.log('command ' + command.name)
 const { plugindb } = require('./index')
 await new plugindb({
  id: command.name,
  url: h,
 }).save()
 fs.unlinkSync(fname)
 return command.name
}
async function remove(h) {
 var jj
 try {
  const { plugindb } = require('.')
  await plugindb.findOneAndDelete({
   id: h,
  })
  jj = `Plugin ${h} deleted from mongodb.`
 } catch {
  jj = 'No such plugins installed.'
 }
 return jj
}
async function allnotes() {
 const { notes } = require('.')
 let leadtext = ` `
 let check = await notes.find({})
 for (let i = 0; i < check.length; i++) {
  let gudbmro = i
  leadtext += `${gudbmro + 1} *ID:-* ${check[i].id}\n*Note:-* ${check[i].note}\n\n`
 }
 return leadtext
}
async function plugins() {
 const { plugindb } = require('.')
 let check = await plugindb.find({})
 let h = ' '
 for (let i = 0; i < check.length; i++) {
  let duh = check[i].url
  let gudbmro = i
  h += `*${gudbmro + 1}:-* ${check[i].id} \n*URL:* ${check[i].url}\n\n`
 }
 return h
}
async function addnote(text) {
 const { notes } = require('.')
 let idd = await notes.countDocuments()
 await new notes({
  id: idd + 1,
  note: text,
 }).save()
 return
}
async function delallnote() {
 const { notes } = require('.')
 await notes.collection.drop()
 return
}
async function delnote(id) {
 const { notes } = require('.')
 await notes.deleteOne({
  id: id,
 })
 return
}
async function divorce(id) {
 const { haigu } = require('.')
 let idd = await haigu.findOne({ id: id })
 await haigu.deleteOne({
  id: idd,
 })
}

async function checkmarried(id) {
 const { Character } = require('mailist')
 const { haigu } = require('.')
 let idd = await haigu.findOne({ id: id })
 let gg = idd.haig
 //  console.log(gg)
 const client = new Character()
 const chara = await client.character(gg).catch(err => {
  data2 = 'No haigusha for uh'
  return data2
 })
 let texty = ''
 texty += `*🏮Name:* ${chara.data.characters.results[0].name.full}*\n`
 texty += `*🌐Source:* ${chara.data.characters.results[0].media.edges[0].node.title.userPreferred}*\n\n`
 texty += `*📶URL:* ${chara.data.characters.results[0].siteUrl}*\n\n`
 //         texty += `*📑Description:* ${chara.data.characters.results[0].description}\n`;
 const { data: char } = (
  await axios.get(`https://api.jikan.moe/v4/characters?q=${chara.data.characters.results[0].name.full}`)
 ).data
 const { data: anime } = (await axios.get(`https://api.jikan.moe/v4/characters/${char[0].mal_id}/anime`)).data
 const { data: voice } = (await axios.get(`https://api.jikan.moe/v4/characters/${char[0].mal_id}/voices`)).data
 let data2 = `*🏮Name:* ${char[0].name}\n*🎗About:* ${char[0].about}\n*🔍MAL_ID:* ${char[0].mal_id}\n🔗 *URL:*  ${chara.data.characters.results[0].siteUrl}\n`
 return data2
}
async function marry(id, text) {
 const { haigu } = require('.')
 await new haigu({
  id: id,
  haig: text,
 }).save()
}
async function isAdmin(Void, jid, sender) {
 const groupMetadata = citel.isGroup ? await Void.groupMetadata(jid).catch(e => {}) : ''
 const participants = citel.isGroup ? await groupMetadata.participants : ''
 const groupAdminss = participants => {
  admins = []
  for (let i of participants) {
   i.admin === 'admin' || i.admin === 'superadmin' ? admins.push(i.id) : ''
  }
  return admins
 }
 const groupAdmins = citel.isGroup ? await groupAdminss(participants) : ''
 const isAdmins = citel.isGroup ? groupAdmins.includes(sender) : false
 return isAdmins
}

async function isBotAdmin(Void, jid, sender) {
 const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(e => {}) : ''
 const participants = citel.isGroup ? await groupMetadata.participants : ''
 const groupAdminss = participants => {
  admins = []
  for (let i of participants) {
   i.admin === 'admin' || i.admin === 'superadmin' ? admins.push(i.id) : ''
  }
  return admins
 }
 const groupAdmins = citel.isGroup ? await groupAdminss(participants) : ''
 const botNumber = await Void.decodeJid(Void.user.id)
 const isBotAdmins = citel.isGroup ? groupAdmins.includes(botNumber) : false
 return isBotAdmins
}

async function syncgit() {
 const simpleGit = require('simple-git')
 const git = simpleGit()
 await git.fetch()
 var commits = await git.log(['main' + '..origin/' + 'main'])
 return commits
}
async function sync() {
 const simpleGit = require('simple-git')
 const git = simpleGit()
 await git.fetch()
 var commits = await git.log(['main' + '..origin/' + 'main'])
 const { prefix } = require('../config')
 var availupdate = '*𝐔𝐩𝐝𝐚𝐭𝐞 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 \n\n'
 commits['all'].map(commit => {
  availupdate += '● [' + commit.date.substring(0, 10) + ']: ' + commit.message + '\n- By:' + commit.author_name + '\n'
 })
 return availupdate
}
module.exports = {
 pinterest,
 delallnote,
 marry,
 checkmarried,
 divorce,
 addnote,
 claim,
 install,
 allnotes,
 remove,
 plugins,
 tlang,
 collection,
 checkcard,
 botpic,
 language: json,
 getString: getString,
 wallpaper,
 delnote,
 wikimedia,
 toAudio,
 toPTT,
 toVideo,
 sync,
 syncgit,
 ffmpeg,
 updatedb,
 TelegraPh,
 uploadFile,
 webp2mp4File,
 fancy,
 randomfancy,
}
