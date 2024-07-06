const { Index, getAdmin, tlang } = require('../lib/')
const eco = require('discord-mongoose-economy')
Index(
 {
  pattern: 'delttt',
  desc: 'deletes TicTacToe running session.',
  category: 'game',
 },
 async (Void, citel, text, { isCreator }) => {
  if (!citel.isGroup) return citel.reply(tlang().group)
  const groupMetadata = citel.isGroup ? await Void.groupMetadata(citel.chat).catch(e => {}) : ''
  const participants = citel.isGroup ? await groupMetadata.participants : ''
  const groupAdmins = await getAdmin(Void, citel)
  const isAdmins = citel.isGroup ? groupAdmins.includes(citel.sender) : false
  if (!isAdmins && !isCreator) return citel.reply('This command is only for Group Admin and my owner.')
  this.game = this.game ? this.game : false
  if (Object.values(this.game).find(room => room.id.startsWith('tictactoe'))) {
   delete this.game
   return citel.reply(`_Successfully Deleted running TicTacToe game._`)
  } else {
   return citel.reply(`No TicTacToe game🎮 is running.`)
  }
 }
)

Index(
 {
  pattern: 'ttt',
  desc: 'Play TicTacToe',
  category: 'game',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) return citel.reply(tlang().group)
  let { prefix } = require('../lib')
  {
   let TicTacToe = require('../lib/ttt')
   this.game = this.game ? this.game : {}
   if (
    Object.values(this.game).find(
     room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(citel.sender)
    )
   )
    return citel.reply('_A game is already going on_')
   let room = Object.values(this.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
   if (room) {
    room.o = citel.chat
    room.game.playerO = citel.sender || citel.mentionedJid[0]
    room.state = 'PLAYING'
    let arr = room.game.render().map(v => {
     return {
      X: '',
      O: '⭕',
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣',
     }[v]
    })
    let str = `
Current turn: @${room.game.currentTurn.split('@')[0]}
Room ID: ${room.id}
${arr.slice(0, 3).join('  ')}
${arr.slice(3, 6).join('  ')}
${arr.slice(6).join('  ')}
`

    return await Void.sendMessage(citel.chat, {
     text: str,
     mentions: [room.game.currentTurn],
    })
   } else {
    room = {
     id: 'tictactoe-' + +new Date(),
     x: citel.chat,
     o: '',
     game: new TicTacToe(citel.sender, 'o'),
     state: 'WAITING',
    }
    if (text) room.name = text
    citel.reply('_Waiting for player,use .ttt to join this game._ ')
    this.game[room.id] = room
   }
  }
 }
)

Index(
 {
  on: 'text',
 },
 async (Void, citel, text) => {
  if (!citel.isGroup) return
  let { prefix } = require('../lib')
  this.game = this.game ? this.game : {}
  let room = Object.values(this.game).find(
   room =>
    room.id &&
    room.game &&
    room.state &&
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(citel.sender) &&
    room.state == 'PLAYING'
  )

  if (room) {
   let ok
   let isWin = !1
   let isTie = !1
   let isSurrender = !1
   if (!/^([1-9]|(me)?give_up|surr?ender|off|skip)$/i.test(citel.text)) return
   isSurrender = !/^[1-9]$/.test(citel.text)
   if (citel.sender !== room.game.currentTurn) {
    if (!isSurrender) return !0
   }
   if (!isSurrender && 1 > (ok = room.game.turn(citel.sender === room.game.playerO, parseInt(citel.text) - 1))) {
    citel.reply(
     {
      '-3': 'The game is over.',
      '-2': 'Invalid',
      '-1': '_Invalid Position_',
      0: '_Invalid Position_',
     }[ok]
    )
    return !0
   }
   if (citel.sender === room.game.winner) isWin = true
   else if (room.game.board === 511) isTie = true
   let arr = room.game.render().map(v => {
    return {
     X: '',
     O: '⭕',
     1: '1️⃣',
     2: '2️⃣',
     3: '3️⃣',
     4: '4️⃣',
     5: '5️⃣',
     6: '6️⃣',
     7: '7️⃣',
     8: '8️⃣',
     9: '9️⃣',
    }[v]
   })
   if (isSurrender) {
    room.game._currentTurn = citel.sender === room.game.playerX
    isWin = true
   }
   let winner = isSurrender ? room.game.currentTurn : room.game.winner
   let str = `Room ID: ${room.id}
      
${arr.slice(0, 3).join('  ')}
${arr.slice(3, 6).join('  ')}
${arr.slice(6).join('  ')}
${
 isWin
  ? `@${winner.split('@')[0]} Won ! and got 2000💎 in wallet🤑`
  : isTie
  ? `Game Tied,well done to both of you players.`
  : `Current Turn ${['', '⭕'][1 * room.game._currentTurn]} @${room.game.currentTurn.split('@')[0]}`
}
⭕:- @${room.game.playerO.split('@')[0]}
:- @${room.game.playerX.split('@')[0]}`

   if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== citel.chat)
    room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = citel.chat
   if (isWin) {
    await eco.give(citel.sender, 'secktor', 2000)
   }
   if (isWin || isTie) {
    await Void.sendMessage(citel.chat, {
     text: str,
     mentions: [room.game.playerO, room.game.playerX],
    })
   } else {
    await Void.sendMessage(citel.chat, {
     text: str,
     mentions: [room.game.playerO, room.game.playerX],
    })
   }
   if (isTie || isWin) {
    delete this.game[room.id]
   }
  }
 }
)
