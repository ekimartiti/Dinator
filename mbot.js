"use strict";
const fs = require('fs');
const {
  InworldClient,
  InworldPacket,
} = require ('@inworld/nodejs-sdk');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage, MessageOptions, Mimetype } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { removeEmojis, bytesToSize, getBuffer, fetchJson, getRandom, getGroupAdmins, runtime, sleep, makeid, isUrl} = require("./function/bot_function");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta").locale("id");
const dconfig = JSON.parse(fs.readFileSync("config.json"));
const { pesan, errorC } = require(`./function/Ui`)
//function
function cekFile(path) {
  try {
    fs.accessSync(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

let arinSesi = {}
let arinKoneksi = {}
//cmd
module.exports = async(mbot, msg, m, setting, store) => {
  try{
 const { type, quotedmsg, mentioned, now, fromMe, isBaileys } = msg 
 if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedmsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedmsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedmsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')  
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid  
const content = JSON.stringify(msg.message)
const userId = sender.split("@")[0];
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = mbot.user.id.split(':')[0] + '@s.whatsapp.net'
const groupMetadata = isGroup ? await mbot.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const quoted = msg.quoted ? msg.quoted : msg
var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList
const isImage = (type == 'imageMessage')
const isQuotedmsg = (type == 'extendedTextMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage');
const isQuotedImage = isQuotedmsg ? content.includes('imageMessage') ? true : false : false
const isVideo = (type == 'videoMessage')
const isQuotedVideo = isQuotedmsg ? content.includes('videoMessage') ? true : false : false
var isWBAX = (type === 'documentMessage' && msg.message.documentMessage.fileName== ('map.wbax')) ? true : false;
const iswbax_quoted = isQuotedmsg && msg.message.extendedTextMessage?.contextInfo.quotedMessage.documentMessage && msg.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage.fileName === 'map.wbax';
const isSticker = (type == 'stickerMessage')
const isQuotedSticker = isQuotedmsg ? content.includes('stickerMessage') ? true : false : false 
const isQuotedAudio = isQuotedmsg ? content.includes('audioMessage') ? true : false : false
const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []
const reply = (teks) => {mbot.sendMessage(from, { text: teks }, { quoted: msg })}
const kirimPesan = (teks) => {mbot.sendMessage(from, { text: teks } )}
const filePath = `db/sesi/${userId}.json`;
function buatSesi (namaSesi){
      var deposit_object = {
      ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
      session: namaSesi,
      data: {
        tc: "",
        tc2:""
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(deposit_object, null, 2))
}
function hapusSesi(filePath){
fs.unlinkSync(filePath);
}
const fileAda = cekFile(filePath);
let cekSesi = function(filePath){
  try{
    let data_deposit = JSON.parse(fs.readFileSync(filePath))
  return data_deposit.session
  }catch (err){
    return false;
  }
}
  const cekSesiHasil = cekSesi(filePath)
  arinSesi[userId] ={ arin: new InworldClient()
    // Get key and secret from the integrations page.
    .setApiKey({
      key: 'zNDzCzmDL8IwtblzBHTn8HIEgNlRAMZA',
      secret: 'zzX10GsbzyWclYnUO1uoCOjqiBX3nmONC5O9yoGkdz1KAzLKkDmgFzfPmZhWRy0S',
    })
    // Setup a user name.
    // It allows character to call you by name.
    .setUser({ fullName: pushname })
    // Setup required capabilities.
    // In this case you can receive character emotions.
    .setConfiguration({
      capabilities: { audio: true, emotions: true },
    })
    // Use a full character name.
    // It should be like workspaces/{WORKSPACE_NAME}/characters/{CHARACTER_NAME}.
    // Or like workspaces/{WORKSPACE_NAME}/scenes/{SCENE_NAME}.
    .setScene('workspaces/default-lxmaplyhs-0wyveqmxeqqw/characters/arin_haniz')
    // Attach handlers
    .setOnError((err) => console.error(err))
  .setOnMessage((namex) => {
    let txnya = namex.text?.text;
    if ( txnya !=  undefined ){
    kirimPesan(txnya)
 }
    }),
    connection: "mamam"
}
switch(command) {
case 'tes':
reply(`*Runtime :* ${runtime(process.uptime())}`)
break
case 'sticker': case 's': case 'stiker':
if (isImage || isQuotedImage){
	reply (pesan.proses)
await mbot.downloadAndSaveMediaMessage(msg, "image", `./sticker/${sender.split("@")[0]}.jpeg`)
var media = fs.readFileSync(`./sticker/${sender.split("@")[0]}.jpeg`)
var opt = { packname: dconfig.botName, author: pushname }
mbot.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
reply(`Kirim gambar dengan caption ${prefix+command} atau balas gambar yang sudah dikirim`)
}
break
case 'sgif':
case 'stickergif':
case 'stikergif':
if (isVideo && msg.message.videoMessage.seconds < 10 || isQuotedVideo && quotedmsg.videoMessage.seconds < 10) {
	reply (pesan.proses)
var media = await mbot.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${sender}.jpeg`)
var opt = { packname: dconfig.botName, author: pushname }
mbot.sendImageAsSticker(from, media, msg, opt)
fs.unlinkSync(media)
} else {
reply(`Kirim video dengan caption ${prefix+command} atau balas video yang sudah dikirim`)
}
break
case 'arin':
if (fileAda === false ){
 buatSesi('arin') 
 reply("Memanggil arin 🌬️")
 try{
    arinKoneksi[userId] = arinSesi[userId].arin.build()
    reply(`Saat ini anda terhubung dengan arin`)
    arinKoneksi[userId].sendText(`Halo saya ${pushname}` )
    console.log(arinSesi[userId])
    }catch(err){
     reply(`Koneksi terputus
pemanggilan gagal`)
    }
  }else{
 reply("Masih ada sesi yang berjalan, silahalan hapus sesi teradahulu dengan perintah #hs")
  }
break
case 'hs':
  if ( fileAda == true ){
  hapusSesi(filePath)
  reply('Sesi berhasil di hapus')
  }else{
    reply('Tidak ada sesi yang berjalan')
  }
  break
case 'tes2':
  mbot.sendMessage(`6282211543299@s.whatsapp.net`, {text: "pagi"});
  break
default:


//kondisi sesi
if (fileAda === true ){
  if ( cekSesiHasil === "arin" ){
    try{
      console.log(arinKoneksi[userId])
    arinKoneksi[userId].sendText(chats)
    }catch(err){
      console.log(err)
     reply(`Koneksi terputus
pemanggilan gagal`)
hapusSesi(filePath)
    }
  }
}

}} catch (err) {
console.log(errorC(err))
}}