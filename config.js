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
  sessionName: process.env.SESSION_ID || 'SESSION_03_29_07_07_eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibURyd3MvT1p0dW5aSXB3dGJ0bG5ZNENxSUZDbzVLTjVnOUVjTGUrYVlrdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2pxNzR4MG1wc0ZPVTBKSThWb1JzbUNqdzI3L1k5VExhVndQZUFORjEzVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyTjIxT21tUjhldmZDRDdUdFRObkJVZWdwRjZPMGtxSWEyY3hRREtXTDM0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJndE9ZaWFRNE1JanYvdktyNXlGMzlYMGRIS3pVTktmOGZIekpXWjdVL0gwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNGbTRFOFNTQlJ2Y2ZKODBnUEhHZDdsaVpvSUcyd29jUEQ5RjIxZTZKa009In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9pd0RGeDQwTEtITTBNTzdWZllTOWtyVWx3bWVQeGNNNDdTNy96QW5ReXM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK0duWjFVUkx2bnFKOHY4TlRJZjhKUGNhblNLMytIZkFxTWp1dkt3ZFlucz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieVBBY3lJdFBwa0dKRVd5TnpBaDVCTkJQWkh2OVlYU1gxVSswVUhnd2lsND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVmcVNvTnI1RTRycDRoRkUwbGZudjJqdTVOMFBmb0F2WkFBd3FMQUNWSnhVeVE5RTVxakp2T2d5NEJJVFJYd2Z2MUY4ZHlvbC9JNGRqcnFCTndvY2hnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NDQsImFkdlNlY3JldEtleSI6InpNVktNbStqcDJoaHZ5RFZ3RjhLak55ODYrYjBEQnp3L2t4TVNxQXFYN2c9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjc2MTg3MjE0NDBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiOUFGRjZENEI1OEZCNzA4MDAwNThEMDI5QzkxRUZGNjkifSwibWVzc2FnZVRpbWVzdGFtcCI6MTcyMDMyMjk4MH0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjc2MTg3MjE0NDBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiNTQ3QjM3MkMwRjI0Qjk2MUZEOTI5NzRCOTFCQzAzRDIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTcyMDMyMjk4MH0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjc2MTg3MjE0NDBAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiOEUwMEUxRjZGNzc4MEM1NTdGMkUwMjVEMTUxQTZGODAifSwibWVzc2FnZVRpbWVzdGFtcCI6MTcyMDMyMjk4Nn1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiVEFHSzdCNVVRb3VOODJnb0QyRERVdyIsInBob25lSWQiOiI1MzQzOGRiYy0zYmNkLTRmN2EtODY4MS00MzcwNDVjNWVkNTEiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNWZsazJWaTVoZGJGVzNnZE94cFlVdXoxblljPSJ9LCJyZWdpc3RlcmVkIjpmYWxzZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyU2ZDZDRKbDBndWNjcGc0Wm4zdUNWazk2b2s9In0sInJlZ2lzdHJhdGlvbiI6e30sImFjY291bnQiOnsiZGV0YWlscyI6IkNOUGVxcVlGRUtDWHFMUUdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJIM2E0U0RkdkdJdDQ5QW9yZUpiQSswVE5aL2xiQ051YkVlcjdSbWQzTGdjPSIsImFjY291bnRTaWduYXR1cmUiOiJ4VmxDZis3ZDFqYkVEY0QwV3Jzdm0wVmJ0eUhrYkVjM3FoWER4WVpsdXljbXo0VFErQ1JONUN6K3VtcHI4bWtYNWZacHh1U2JXaS9NdzlhRmdUR2ZDUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiM2ZFeUM2ZTE3K0kzVnN3L3ZSSVBhMVF0YktZajZtWE9PRzNwYTZLck5KQmhXdGRRQzBOd2Y1QTdhdXlESGpUNDlyNFFjVVhXUUIySEZVeHpQa21Pamc9PSJ9LCJtZSI6eyJpZCI6IjI3NjE4NzIxNDQwOjQ0QHMud2hhdHNhcHAubmV0IiwibmFtZSI6IuKHovCThqnwnZi08J2YrPCdmLoifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc2MTg3MjE0NDA6NDRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCUjkydUVnM2J4aUxlUFFLSzNpV3dQdEV6V2Y1V3dqYm14SHErMFpuZHk0SCJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMDMyMjk3OCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFNM3gifQ==',
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
