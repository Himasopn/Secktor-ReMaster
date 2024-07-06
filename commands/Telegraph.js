const { Index } = require('../lib')
const util = require('util')
const axios = require('axios')
Index(
 {
  pattern: 'paste',
  desc: 'create paste of text.',
  category: 'extra',
 },
 async message => {
  let a = message.quoted ? message.quoted.text : message.text
  let { data } = await axios.get(
   `https://api.telegra.ph/createPage?access_token=d3b25feccb89e508a9114afb82aa421fe2a9712b963b387cc5ad71e58722&title=Secktor-Md+Bot&author_name=AstroFx0011&content=[%7B"tag":"p","children":["${a.replace(
    / /g,
    '+'
   )}"]%7D]&return_content=true`
  )
  return message.reply(
   `*Paste created on telegraph*\nName:-${util.format(data.result.title)} \nUrl:- ${util.format(data.result.url)}`
  )
 }
)
