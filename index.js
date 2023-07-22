"use strict";
const { gaya } = require("./function/ui")
console.log(gaya.dinatorG)
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent, fetchLatestBaileysVersion, fetchLatestWaWebVersion } = require("@adiwajshing/baileys")
const chalk = require('chalk')
const { pino, logg } = require('pino')
const fs = require("fs");
const { serialize, fetchJson, getBuffer, nocache, uncache, status_Connection } = require("./function/bot_function");
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
let setting = JSON.parse(fs.readFileSync('./config.json'));
const sessionName = setting.sessionName

const keepAlive = require('./server');
const Monitor = require('ping-monitor');

keepAlive();
const monitor = new Monitor({
    website: '',
    title: 'NAME',
    interval: 2
});

monitor.on('up', (res) => console.log(`${res.website} its on.`));
monitor.on('down', (res) => console.log(`${res.website} it has died - ${res.statusMessage}`));
monitor.on('stop', (website) => console.log(`${website} has stopped.`) );
monitor.on('error', (error) => console.log(error));

const connectToWhatsApp = async () => {
const { state, saveCreds } = await useMultiFileAuthState(`./${sessionName ? sessionName : "session"}`);
const { version, isLatest } = await fetchLatestWaWebVersion().catch(() => fetchLatestBaileysVersion());

const mbot = makeWASocket({
	version: [2, 2323, 4],
printQRInTerminal: true,
logger: pino({ level: 'fatal' }),
browser: ['Dinator','Safari','1.0.0'],
auth: state
})
store.bind(mbot.ev);

mbot.ev.on('messages.upsert', async m => {
var msg = m.messages[0]
if (!m.messages) return;
if (msg.key && msg.key.remoteJid == "status@broadcast") return
msg = serialize(mbot, msg)
msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
require('./mbot')(mbot, msg, m, setting, store)
})

mbot.ev.on ('creds.update', saveCreds)

mbot.reply = (from, content, msg) => mbot.sendMessage(from, { text: content }, { quoted: msg })


mbot.ev.on('connection.update', (update) => {
status_Connection(mbot, update, connectToWhatsApp)
})

//mbot.ev.on('group-participants.update', 
// async (update) =>{
// const isWelcome = welcome_JSON
// if(!isWelcome.includes(update.id)) return
// groupResponse_Demote(mbot, update)
// groupResponse_Promote(mbot, update)
// groupResponse_Welcome(mbot, update)
// groupResponse_Remove(mbot, update)
// console.log(update)
// })
mbot.ev.on('group-update', async (anu) => {
updateGroup(mbot, anu, MessageType)
})

mbot.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await mbot.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

mbot.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

mbot.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
  if (type_file === 'image') {
    var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(path_file, buffer)
    return path_file
  } else if (type_file === 'video') {
    var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(path_file, buffer)
    return path_file
  } else if (type_file === 'sticker') {
    var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(path_file, buffer)
    return path_file
  } else if (type_file === 'audio') {
    var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(path_file, buffer)
    return path_file
  } else if (type_file === 'document') { // tambahkan kondisi untuk file dokumen wbax
    var stream = await downloadContentFromMessage(msg.message.documentMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.documentMessage, 'document')
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    fs.writeFileSync(path_file, buffer)
    return path_file
  }
}


mbot.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await mbot.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

mbot.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await mbot.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}
return mbot
}
connectToWhatsApp()
.catch(err => console.log(err))
