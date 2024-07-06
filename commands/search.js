const moment = require('moment-timezone')
const { fetchJson, Index, tlang } = require('../lib')
const asyncGis = require('async-g-i-s')
const axios = require('axios')
const fetch = require('node-fetch')

Index(
 {
  pattern: 'imdb',
  category: 'search',
  desc: 'Sends image of asked Movie/Series.',
 },
 async (context, message, query) => {
  if (!query) return message.reply(`_Name a series or movie ${tlang().greet}._`)

  let response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${query}&plot=full`)
  let imdbData = response.data

  let imdbText = ''
  imdbText += '⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n' + ' ``` IMDB SEARCH```\n' + '⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n'
  imdbText += `🎬Title: ${imdbData.Title}\n`
  imdbText += `📅Year: ${imdbData.Year}\n`
  imdbText += `⭐Rated: ${imdbData.Rated}\n`
  imdbText += `📆Released: ${imdbData.Released}\n`
  imdbText += `⏳Runtime: ${imdbData.Runtime}\n`
  imdbText += `🌀Genre: ${imdbData.Genre}\n`
  imdbText += `👨🏻‍💻Director: ${imdbData.Director}\n`
  imdbText += `✍Writer: ${imdbData.Writer}\n`
  imdbText += `👨Actors: ${imdbData.Actors}\n`
  imdbText += `📃Plot: ${imdbData.Plot}\n`
  imdbText += `🌐Language: ${imdbData.Language}\n`
  imdbText += `🌍Country: ${imdbData.Country}\n`
  imdbText += `🎖️Awards: ${imdbData.Awards}\n`
  imdbText += `📦BoxOffice: ${imdbData.BoxOffice}\n`
  imdbText += `🏙️Production: ${imdbData.Production}\n`
  imdbText += `🌟imdbRating: ${imdbData.imdbRating}\n`
  imdbText += `❎imdbVotes: ${imdbData.imdbVotes}`

  context.sendMessage(
   message.chat,
   {
    image: { url: imdbData.Poster },
    caption: imdbText,
   },
   { quoted: message }
  )
 }
)
Index(
 {
  pattern: 'weather',
  category: 'search',
  desc: 'Sends weather info about asked place.',
 },
 async (context, message, location) => {
  if (!location) return message.reply('Give me a location.')

  let weatherData = await axios.get(
   `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en`
  )

  let weatherText = ''
  weatherText += `*🌟Weather of ${location}*\n\n`
  weatherText += `*Weather:* ${weatherData.data.weather[0].main}\n`
  weatherText += `*Description:* ${weatherData.data.weather[0].description}\n`
  weatherText += `*Avg Temp:* ${weatherData.data.main.temp}\n`
  weatherText += `*Feels Like:* ${weatherData.data.main.feels_like}\n`
  weatherText += `*Pressure:* ${weatherData.data.main.pressure}\n`
  weatherText += `*Humidity:* ${weatherData.data.main.humidity}\n`
  weatherText += `*Wind Speed:* ${weatherData.data.wind.speed}\n`
  weatherText += `*Latitude:* ${weatherData.data.coord.lat}\n`
  weatherText += `*Longitude:* ${weatherData.data.coord.lon}\n`
  weatherText += `*Country:* ${weatherData.data.sys.country}\n`

  context.sendMessage(message.chat, { text: weatherText }, { quoted: message })
 }
)
Index(
 {
  pattern: 'horo',
  category: 'search',
  desc: 'Gives horoscope info of user.',
  use: '<sign>\nExample: horo libra',
  
 },
 async (context, message, sign) => {
  if (!sign) return message.reply('Provide me a sign!')

  try {
   const URL = `https://aztro.sameerkumar.website/?sign=${sign}&day=today`
   fetch(URL, { method: 'POST' })
    .then(response => response.json())
    .then(json => {
     let horoscopeText = ''
     horoscopeText += `*🌟 Horoscope of ${sign}*\n\n`
     horoscopeText += `*Current Date:* ${json.current_date}\n`
     horoscopeText += `*Sign:* ${sign}\n`
     horoscopeText += `*Lucky Time:* ${json.lucky_time}\n`
     horoscopeText += `*Compatibility:* ${json.compatibility}\n`
     horoscopeText += `*Lucky Number:* ${json.lucky_number}\n`
     horoscopeText += `*Lucky Color:* ${json.color}\n`
     horoscopeText += `*Today Mood:* ${json.mood}\n`
     horoscopeText += `*Overall:* ${json.description}\n`

     message.reply(horoscopeText)
    })
  } catch (error) {
   console.log(error)
  }
 }
)
Index(
 {
  pattern: 'google',
  category: 'search',
  desc: 'Sends info of given query from Google Search.',
 },
 async (context, message, query) => {
  if (!query) return message.reply('Provide a query\n*Example: .google Who is Suhail Tech.*')

  const googleSearch = require('google-it')
  googleSearch({ query }).then(results => {
   let resultText = `Google Search Results for: ${query}\n\n`
   results.forEach(result => {
    resultText += `➣ Title: ${result.title}\n`
    resultText += `➣ Description: ${result.snippet}\n`
    resultText += `➣ Link: ${result.link}\n\n`
   })

   message.reply(resultText)
  })
 }
)
Index(
 {
  pattern: 'image',
  category: 'search',
  desc: 'Searches Image on Google',
 },
 async (context, message, query) => {
  if (!query) return message.reply('Provide a query!')

  let [searchQuery, numberOfImages] = query.split('|')
  numberOfImages = numberOfImages || '1'

  message.reply(`Sending ${numberOfImages} image(s) of ${searchQuery}`)

  for (let i = 0; i < numberOfImages; i++) {
   let images = await asyncGis(searchQuery)
   let randomImage = images[Math.floor(Math.random() * images.length)].url

   let buttonMessage = {
    image: { url: randomImage },
    caption: `_Sector Image Search_\n*${searchQuery}*`,
    headerType: 4,
   }

   context.sendMessage(message.chat, buttonMessage, { quoted: message })
  }
 }
)
Index(
 {
  pattern: 'couplepp',
  category: 'search',
  desc: 'Sends two couples pics.',
  
 },
 async (context, message) => {
  let couplePics = await fetchJson('https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json')
  let randomCouple = couplePics[Math.floor(Math.random() * couplePics.length)]

  context.sendMessage(message.chat, { image: { url: randomCouple.male }, caption: 'Couple Male' }, { quoted: message })
  context.sendMessage(
   message.chat,
   { image: { url: randomCouple.female }, caption: 'Couple Female' },
   { quoted: message }
  )
 }
)
Index(
 {
  pattern: 'iswa',
  category: 'search',
  desc: 'Searches in given range about given number.',
 },
 async (context, message, number) => {
  let inputNumber = number.split(' ')[0]
  if (!inputNumber.includes('x')) return message.reply('You did not add x\nExample: iswa 9196285162xx')

  message.reply('Searching for WhatsApp accounts in given range...')

  function countInstances(string, word) {
   return string.split(word).length - 1
  }

  let baseNumber = inputNumber.split('x')[0]
  let suffixNumber = inputNumber.split('x')[countInstances(inputNumber, 'x')] || ''
  let randomLength = countInstances(inputNumber, 'x')
  let range = Math.pow(10, randomLength)

  let resultText = `*--『 List of WhatsApp Numbers 』--*\n\n`
  let noBioText = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`
  let noWhatsappText = `\n*Numbers with no WhatsApp account within provided range.*\n`

  for (let i = 0; i < range; i++) {
   let generatedNumber = baseNumber + i + suffixNumber
   let waUser = await context.onWhatsApp(`${generatedNumber}@s.whatsapp.net`)

   if (waUser.length === 0) {
    noWhatsappText += `${generatedNumber}\n`
    continue
   }

   try {
    let waStatus = await context.fetchStatus(waUser[0].jid)
    resultText += `🧐 *Number:* wa.me/${waUser[0].jid.split('@')[0]}\n ✨*Bio :* ${
     waStatus.status
    }\n🍁*Last update :* ${moment(waStatus.setAt).tz('Asia/Kolkata').format('HH:mm:ss DD/MM/YYYY')}\n\n`
   } catch {
    noBioText += `wa.me/${waUser[0].jid.split('@')[0]}\n`
   }
  }

  message.reply(`${resultText}${noBioText}${noWhatsappText}`)
 }
)
