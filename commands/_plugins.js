const axios = require('axios')
const fs = require('fs-extra')
const { plugins, plugindb, remove, isUrl, Index } = require('../lib/index')

Index(
 {
  pattern: 'plugins',
  category: 'owner',
  desc: 'Shows list of all externally installed modules',
 },
 async (context, message, args, { isCreator }) => {
  const { tlang } = require('../lib')
  if (!isCreator) {
   return message.reply(tlang().owner)
  }
  let installedPluginsText = `*All Installed Plugins are:-*\n\n`
  installedPluginsText += await plugins()
  return message.reply(installedPluginsText)
 }
)

Index(
 {
  pattern: 'remove',
  category: 'owner',
  desc: 'Removes external plugins.',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) {
   return message.reply(tlang().owner)
  }
  if (args === 'all') {
   await plugindb.collection.drop()
   return message.reply('Deleted all plugins.')
  }
  let pluginName = args.split(' ')[0]
  let removalMessage = await remove(pluginName)
  delete require.cache[require.resolve(__dirname + '/' + pluginName + '.js')]
  fs.unlinkSync(__dirname + '/' + pluginName + '.js')
  return message.reply(removalMessage)
 }
)

Index(
 {
  pattern: 'install',
  category: 'owner',
  desc: 'Installs external modules.',
 },
 async (context, message, args, { isCreator }) => {
  if (!isCreator) {
   return message.reply(tlang().owner)
  }
  let pluginUrlText = args || (message.quoted && message.quoted.text) || message.text
  for (let urlString of isUrl(pluginUrlText)) {
   try {
    var url = new URL(urlString)
   } catch {
    return message.reply('_Invalid URL_')
   }
   let { data } = await axios.get(url.href)
   let patternMatch = /pattern: ["'](.*)["'],/g.exec(data)
   let pluginPattern = patternMatch[0].split(' ')[1] || Math.random().toString(36).substring(8)
   let pluginName = pluginPattern.replace(/[^A-Za-z]/g, '')
   let pluginPath = __dirname + '/' + pluginName + '.js'

   await fs.writeFileSync(pluginPath, data, 'utf8')
   try {
    require(pluginPath)
   } catch (error) {
    fs.unlinkSync(pluginPath)
    return message.reply('Invalid Plugin\n ```' + error + '```')
   }

   const newPlugin = { id: pluginName, url: url }
   await new plugindb(newPlugin).save()
   return message.reply(`_Plugin_ *${pluginName}* _installed._`)
  }
 }
)
