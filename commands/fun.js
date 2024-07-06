const { dare, truth, random_question } = require('../lib/truth-dare.js')
const axios = require('axios')
const { Index } = require('../lib')
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'question',
  desc: 'Random Question.',
  category: 'fun',
 },
 async (Void, citel, text) => {
  return await citel.reply(`${random_question()}`)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'truth',
  desc: 'truth and dare(truth game.).',
  category: 'fun',
 },
 async (Void, citel, text) => {
  return await citel.reply(`${truth()}`)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'dare',
  desc: 'truth and dare(dare game.).',
  category: 'fun',
 },
 async (Void, citel, text) => {
  return await citel.reply(`${dare()}`)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'fact',
  desc: 'Sends fact in chat.',
  category: 'fun',
 },
 async (Void, citel, text) => {
  const { data } = await axios.get(`https://nekos.life/api/v2/fact`)
  return citel.reply(`*Fact:* ${data.fact}\n\n*Powered by Secktor*`)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'quotes',
  desc: 'Sends quotes in chat.',
  category: 'fun',
 },
 async (Void, citel, text) => {
  var quoo = await axios.get(`https://favqs.com/api/qotd`)
  const replyf = `
╔════◇
║ *🎗️Content:* ${quoo.data.quote.body}
║ *👤Author:* ${quoo.data.quote.author}
║    
╚════════════╝ `
  return citel.reply(replyf)
 }
)
//---------------------------------------------------------------------------
Index(
 {
  pattern: 'define',
  desc: 'urban dictionary.',
  category: 'fun',
 },
 async (Void, citel, text) => {
  try {
   let { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${text}`)
   var textt = `
            Word: ${text}
            Definition: ${data.list[0].definition.replace(/\[/g, '').replace(/\]/g, '')}
            Example: ${data.list[0].example.replace(/\[/g, '').replace(/\]/g, '')}`
   return citel.reply(textt)
  } catch {
   return citel.reply(`No result for ${text}`)
  }
 }
)
