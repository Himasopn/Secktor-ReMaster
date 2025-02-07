const fs = require('fs-extra');
if (fs.existsSync('config.env')) require('dotenv').config({ path: __dirname + '/config.env' });

//═══════[Required Variables]════════\\
global.owner = process.env.OWNER_NUMBER ? process.env.OWNER_NUMBER.split(",") : [];
global.mongodb = process.env.MONGODB_URI || "mongodb+srv://astrofx0011:astro@cluster0.lmwnxdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
global.port = process.env.PORT || 5000;
global.email = 'sam@secktor.live';
global.github = 'https://github.com/SamPandey001/Secktor-Md';
global.location = 'Sultanpur IN';
global.gurl = 'https://instagram.com/'; // add your username
global.sudo = process.env.SUDO || '917002015750';
global.devs = '917002015750';
global.website = 'https://github.com/SamPandey001/Secktor-Md'; //wa.me/+91000000000000
global.THUMB_IMAGE = process.env.THUMB_IMAGE || 'https://raw.githubusercontent.com/SecktorBot/Brandimages/main/logos/SocialLogo%201.png';

module.exports = {
  botname: process.env.BOT_NAME || '𝐒𝐞𝐜𝐤𝐭𝐨𝐫 𝐁𝐨𝐭𝐭𝐨',
  ownername: process.env.OWNER_NAME || 'AS',
  sessionName: process.env.SESSION_ID 'SESSION_03_29_07_07_ValentiDorian',
  author: process.env.PACK_INFO ? process.env.PACK_INFO.split(";")[0] : 'SamPandey001',
  auto_read_status: process.env.AUTO_READ_STATUS || false,
  packname: process.env.PACK_INFO ? process.env.PACK_INFO.split(";")[1] : 'Secktor-Md',
  autoreaction: process.env.AUTO_REACTION || false,
  antibadword: process.env.ANTI_BAD_WORD || 'nbwoed',
  alwaysonline: process.env.ALWAYS_ONLINE || false,
  antifake: process.env.FAKE_COUNTRY_CODE || '971',
  readmessage: process.env.READ_MESSAGE || false,
  auto_status_saver: process.env.AUTO_STATUS_SAVER || false,
  HANDLERS: process.env.PREFIX ? process.env.PREFIX.split('') : ['.'],
  warncount: process.env.WARN_COUNT || 3,
  disablepm: process.env.DISABLE_PM || false,
  levelupmessage: process.env.LEVEL_UP_MESSAGE || false,
  antilink: process.env.ANTILINK_VALUES || 'chat.whatsapp.com',
  antilinkaction: process.env.ANTILINK_ACTION || 'remove',
  BRANCH: 'main', 
  ALIVE_MESSAGE: process.env.ALIVE_MESSAGE || '',
  autobio: process.env.AUTO_BIO || false,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || false,
  heroku: process.env.heroku || false,
  HEROKU: {
    HEROKU: process.env.HEROKU || false,
    API_KEY: process.env.HEROKU_API_KEY || '',
    APP_NAME: process.env.HEROKU_APP_NAME || ''
  },
  VERSION: process.env.VERSION || 'v.0.0.3',
  LANG: process.env.THEME || 'SECKTOR',
  WORKTYPE: process.env.WORKTYPE || 'public'
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update '${__filename}'`);
  delete require.cache[file];
  require(file);
});
