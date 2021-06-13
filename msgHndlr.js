const {
    decryptMedia
} = require('@open-wa/wa-decrypt')
const axios = require("axios");
const fs = require('fs-extra')
const moment = require('moment-timezone')
const {
    waifuR
} = require('waifur')
const color = require('./lib/color')
const {
    exec
} = require('child_process')
const nhentai = require('nhentai-js')
const translate = require('@vitalets/google-translate-api');
const {
    API
} = require('nhentai-api')
const {
    liriklagu,
    quotemaker,
    randomNimek,
    fb
} = require('./lib/functions')
const {
    help,
    readme,
    langCode,
    youtube_parser,
    getFileSize,
    getlangCodes
} = require('./lib/help')

const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const restrictMembers_ = JSON.parse(fs.readFileSync('./lib/restrictMembers.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
var Downloader = require("./lib/downloader");
var dl = new Downloader();
const ytdl = require('ytdl-core');
const sharp = require('sharp');

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const {
            type,
            id,
            from,
            t,
            sender,
            isGroupMsg,
            chat,
            caption,
            isMedia,
            mimetype,
            quotedMsg,
            quotedMsgObj,
            mentionedJidList
        } = message
        let {
            body
        } = message
        const {
            name,
            formattedTitle
        } = chat
        let {
            pushname,
            verifiedName
        } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args = commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10) {
                    return `${message.substr(0, 15)}`
                } else {
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: 'In progress⏳ please wait a moment',
            error: {
                St: '[❗] Send an image with the caption *!sticker* or tag the image that has been sent',
                Qm: '[❗] An error occurred, maybe the theme is not available!',
                Yt3: '[❗] An error occurred, can\'t convert to mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] An error occurred, maybe the error was caused by the system.',
                Ki: '[❗] Bot can\'t remove group admin!',
                Ad: '[❗] Can\'t add target, maybe because it\'s private',
                Iv: '[❗] The link you sent is not valid!'
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const ownerNumber = ["+9195xxxxxxx", "9195xxxxxxx@c.us", "9195xxxxxxx"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isOwner ? true : isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false


        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isOwner ? true : isGroupMsg ? nsfw_.includes(chat.id) : true
        const isMemberRestricted = isGroupMsg ? restrictMembers_.includes(chat.id) : isOwner ? true : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        if (command.startsWith('!') && isMemberRestricted && !isGroupAdmins && isGroupMsg) return client.reply(from, 'Members are restricted from using the bot', id)
        switch (command) {
            case '!listmeme':
                var config = {
                    method: 'get',
                    url: 'https://api.imgflip.com/get_memes',
                    headers: {}
                };
                axios(config)
                    .then(function (response) {
                        let data = response.data["data"];
                        let result = "More detail using: *!memeimage [id]* \n";
                        data["memes"].forEach(meme => {
                            result += meme.id + " : " + meme.name + "\n"
                        })
                        client.reply(from, result, id)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break
            case '!memeimage':
                if (args.length === 1) return client.reply(from, 'Use *!memeImage [id]*, e.g. *!memeimage 97984*', id)
                args[1] = args[1].trim();
                var config = {
                    method: 'get',
                    url: 'https://api.imgflip.com/get_memes',
                    headers: {}
                };
                axios(config)
                    .then(function (response) {
                        let data = response.data["data"]["memes"];
                        let result = "";
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id == args[1]) {
                                client.sendFileFromUrl(from, data[i].url, `${data[i].name}.jpg`, `➸ *Name* : ${data[i].name}\n➸ Build your meme \n*!gmeme ?${data[i].id}?I am top?I am bottom* `, id)
                                break
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break
            case '!fb':
                if (args.length === 1) return client.reply(from, 'Send order *!fb [linkFb]*', id)
                if (!(args[1].includes('facebook.com') || args[1].includes('fb.watch'))) return client.reply(from, mess.error.Iv, id)
                client.reply(from, mess.wait, id)
                const resp = await fb(args[1]);
                client.sendFileFromUrl(from, resp.url, `${resp.capt}${resp.exts}`, resp.capt, id)
                break
            case '!sticker':
            case '!stiker':
                async function processImage(bufferImage, type) {
                    const mediaData = await decryptMedia(bufferImage, uaOverride)
                    const image = sharp(mediaData);
                    let paddingLR, paddingTB;
                    let metadata = await image.metadata();
                    paddingLR = metadata.height > metadata.width ? Math.round((metadata.height - metadata.width) / 2) : 0;
                    paddingTB = metadata.height < metadata.width ? Math.round((metadata.width - metadata.height) / 2) : 0;
                    let paddedImage = await image
                        .extend({
                            top: paddingTB,
                            bottom: paddingTB,
                            left: paddingLR,
                            right: paddingLR,
                            background: {
                                r: 0,
                                g: 0,
                                b: 0,
                                alpha: 0
                            }
                        }).png()
                        .toBuffer();
                    const imageBase64 = `data:${type};base64,${paddedImage.toString('base64')}`
                    await client.sendImageAsSticker(from, imageBase64)
                }
                if (isMedia && type === 'image') {
                    await processImage(message, mimetype);
                } else if (quotedMsg && quotedMsg.type == 'image') {
                    await processImage(quotedMsg, quotedMsg.mimetype);
                } else if (args.length === 2) {
                    const url = args[1]
                    if (url.match(isUrl)) {
                        await client.sendStickerfromUrl(from, url, {
                                method: 'get'
                            })
                            .catch(err => console.log('Caught exception: ', err))
                    } else {
                        client.reply(from, mess.error.Iv, id)
                    }
                } else {
                    client.reply(from, mess.error.St, id)
                }
                break
            case '!stickergif':
            case '!stikergif':
            case '!sgif':
                async function handleGif(media, type) {
                    const mediaData = await decryptMedia(media, uaOverride)
                    client.reply(from, mess.wait, id)
                    let random = Math.floor(Math.random() * 10000) + 1;
                    const filename = `./media/${random}.${type.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/${random}.gif --fps=30 --scale=120:120`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync(`./media/${random}.gif`, {
                            encoding: "base64"
                        })
                        client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`).then(() => {
                            fs.unlink(filename);
                            fs.unlink(`./media/${random}.gif`);
                        })
                    })
                }
                if (isMedia) {
                    if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                        handleGif(message, mimetype);
                    } else(
                        client.reply(from, 'Please select a video/gif less than 10 sec long', id)
                    )
                } else if (quotedMsg && quotedMsg.isMedia) {
                    if (quotedMsg.mimetype === 'video/mp4' && quotedMsg.duration < 10 || quotedMsg.mimetype === 'image/gif' && quotedMsg.duration < 10) {
                        handleGif(quotedMsg, quotedMsg.mimetype);
                    } else(
                        client.reply(from, 'Please select a video/gif less than 10 sec long', id)
                    )
                }
                break
            case '!tts':
                function serveAudio(text, lang) {
                    const tts = require('node-gtts')(lang)
                    let random = Math.floor(Math.random() * 10000) + 1;
                    let loc = './media/tts/resHi' + random + '.mp3'
                    tts.save(loc, text, function () {
                        client.sendPtt(from, loc, id).then(() => {
                            fs.unlink(loc);
                        })
                    })
                }
                var langcodes = getlangCodes();
                if (args.length === 1) return client.reply(from, 'Use *!tts [lang] [text]*, e.g. *!tts hi Good Morning*', id)
                var dataBhs = body.split("!tts")[1].trim().split(" ")[0];
                dataBhs = langcodes.includes(body.split("!tts")[1].trim().split(" ")[0]) ? dataBhs : false;
                var dataText = dataBhs ? body.slice(8) : body.slice(5);
                var fromLang = dataText.split(":")[1] != null ? dataText.split(":")[1].trim() : "";
                if (dataText === '') return client.reply(from, 'Baka?', id)
                if (dataText.length > 500) return client.reply(from, 'The text is too long!', id)
                if (dataBhs) {
                    translate(dataText.split(":")[0].trim(), {
                        from: fromLang == '' ? 'auto' : fromLang,
                        to: dataBhs
                    }).then(res => {
                        serveAudio(res.text, dataBhs);
                    }).catch(err => {
                        console.log(err);
                        client.reply(from, 'Translation failed', id)
                    });
                } else {
                    serveAudio(dataText, 'en');
                }
                break
            case '!ytmp3':
                if (args.length === 1) return client.reply(from, 'Send the command *!ytmp3 [linkYt]*, for example please send the command *!readme*')
                let parsedId = youtube_parser(args[1])
                if (!parsedId) return client.reply(from, mess.error.Iv, id)
                try {
                    client.reply(from, mess.wait, id)
                    dl.getMP3({
                        videoId: parsedId
                    }, async function (err, res) {
                        if (err)
                            throw err;
                        else {
                            const {
                                videoTitle,
                                file,
                                thumbnail
                            } = res;
                            const filesize = getFileSize(file);
                            if (Number(filesize) >= 30.00) return client.reply(from, 'Sorry, the video duration has exceeded the maximum limit!', id)
                            await client.sendFileFromUrl(from, thumbnail, 'thumbnail.jpg', `➸ *Title* : ${videoTitle}\n➸ *Filesize* : ${filesize} MB \n\nPlease wait, File upload may take few minutes.`, id)
                            await client.sendAudio(from, file, id)
                            console.log(res);
                        }
                    });
                } catch (err) {
                    console.log(err);
                    client.sendText(ownerNumber[0], 'Error ytmp3 : ' + err)
                    client.reply(from, mess.error.Yt3, id)
                }
                break
            case '!ytmp4':
                if (args.length === 1) return client.reply(from, 'Send the command *!ytmp3 [linkYt]*, for example please send the command *!readme*')
                let parsedVideoId = youtube_parser(args[1])
                if (!parsedVideoId) return client.reply(from, mess.error.Iv, id)
                let info = await ytdl.getInfo(parsedVideoId);
                let format = ytdl.chooseFormat(info.formats, {
                    quality: 'highest'
                });
                const vThumb = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]["url"];
                const vTitle = info.videoDetails.title;
                try {
                    client.reply(from, mess.wait, id)
                    client.sendFileFromUrl(from, vThumb, 'thumb.jpg', `➸ *Title* : ${vTitle}\n\nPlease wait, File upload may take few minutes.`, id)
                    await client.sendFileFromUrl(from, format.url, `${vTitle}.mp4`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                } catch (er) {
                    client.sendText(ownerNumber[0], 'Error ytmp4 : ' + er)
                    client.reply(from, mess.error.Yt4, id)
                }
                break
            case '!nsfw':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins!', id)
                if (args.length === 1) return client.reply(from, 'Select enable or disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    nsfw_.push(chat.id)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                    client.reply(from, 'NSWF Command has been successfully activated in this group! send command *!nsfwMenu* to find the menu', id)
                } else if (args[1].toLowerCase() === 'disable') {
                    nsfw_.splice(chat.id, 1)
                    fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                    client.reply(from, 'NSFW Command has been successfully disabled in this group!', id)
                } else {
                    client.reply(from, 'Select enable or disable!', id)
                }
                break
            case '!restrictmember':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins!', id)
                if (args.length === 1) return client.reply(from, 'Select enable or disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    restrictMembers_.push(chat.id)
                    fs.writeFileSync('./lib/restrictMembers.json', JSON.stringify(restrictMembers_))
                    client.reply(from, 'Members has been successfully restricted in this group!', id)
                } else if (args[1].toLowerCase() === 'disable') {
                    restrictMembers_.splice(chat.id, 1)
                    fs.writeFileSync('./lib/restrictMembers.json', JSON.stringify(restrictMembers_))
                    client.reply(from, 'Members restrictions has been successfully lifted in this group!', id)
                } else {
                    client.reply(from, 'Select enable or disable!', id)
                }
                break
            case '!welcome':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins!', id)
                if (args.length === 1) return client.reply(from, 'Select enable or disable!', id)
                if (args[1].toLowerCase() === 'enable') {
                    welkom.push(chat.id)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                    client.reply(from, 'The welcome feature has been successfully activated in this group!', id)
                } else if (args[1].toLowerCase() === 'disable') {
                    welkom.splice(chat.id, 1)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                    client.reply(from, 'The welcome feature has been successfully disabled in this group!', id)
                } else {
                    client.reply(from, 'Select enable or disable!', id)
                }
                break
            case '!nsfwmenu':
                if (!isNsfw) return
                client.reply(from, '1. !randomHentai\n2. !nh [6 digit code] \n3. !randomnsfwneko\n4. !randomtrap\n', id)
                break
            case '!nh':
                if (!isNsfw) return
                if (args.length === 2) {
                    const nuklir = body.split(' ')[1]
                    client.reply(from, mess.wait, id)
                    const cek = await nhentai.exists(nuklir)
                    if (cek === true) {
                        try {
                            const api = new API()
                            const pic = await api.getBook(nuklir).then(book => {
                                return api.getImageURL(book.cover)
                            })
                            const dojin = await nhentai.getDoujin(nuklir)
                            const {
                                title,
                                details,
                                link,
                                pages
                            } = dojin
                            const {
                                parodies,
                                tags,
                                artists,
                                languages,
                                categories
                            } = details


                            var teks = `*Title* : ${title}\n\n*Parodies* : ${parodies}\n\n*Tags* : ${tags.join(', ')}\n\n*Artists* : ${artists.join(', ')}\n\n*Languages* : ${languages.join(', ')}\n\n*Categories* : ${categories}\n\n*Link* : ${link}\n\n*Note* : Pdf sharing will be supported soon`
                            client.sendFileFromUrl(from, pic, 'hentod.jpg', teks, id)
                            // Generate pdf but we need to host it somewhere so it can be shared
                            // let pdfs = [];
                            // for (let i = 0, start = 0, end = 40; i < Math.ceil(pages.length / 40); i++) {
                            //     let parr = [];
                            //     let files = [];
                            //     let slice = pages.slice(start, end);

                            //     slice.forEach(p => {
                            //         parr.push(new Promise((resolve, reject) => {
                            //             let loc = "./media/temp/" + nuklir + "_" + p.split("/")[5];
                            //             files.push(loc)
                            //             fetch(p)
                            //                 .then(res => res.buffer())
                            //                 .then(buffer => {
                            //                     fs.writeFile(loc, buffer, () =>
                            //                         resolve());
                            //                 });
                            //         }))
                            //     })
                            //     start += 40;
                            //     end = i == Math.ceil(pages.length / 40) - 1 ? pages.length - 1 : end + 40;
                            //     await Promise.all(parr)
                            //     let pdfLoc = "./media/temp/" + nuklir + "_part_" + (i + 1) + ".pdf";
                            //     await imagesToPdf(files, pdfLoc)
                            //     files.forEach(file => {
                            //         fs.unlinkSync(file);
                            //     })
                            //     pdfs.push(pdfLoc)
                            // }
                            // var merger = new PDFMerger();
                            // pdfs.forEach(pdf => {
                            //     merger.add(pdf);
                            //     fs.unlinkSync(pdf);
                            // })
                            // await merger.save("./media/temp/" + nuklir + ".pdf");

                            // client.sendFile(from, "./media/temp/" + nuklir + ".pdf",`${title}.pdf`,'Happy', id)

                        } catch (err) {
                            console.log(err);
                            client.reply(from, '[❗] An error occurred, maybe the nuClear code is wrong', id)
                        }
                    } else {
                        client.reply(from, '[❗] Incorrect nuClear code!', id)
                    }
                } else {
                    client.reply(from, '[ WRONG ] Send command *!nh [nuClear]* for example send command *!readme*', id)
                }
                break
            case '!wait':
                if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                    if (isMedia) {
                        var mediaData = await decryptMedia(message, uaOverride)
                    } else {
                        var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    }
                    const fetch = require('node-fetch')
                    const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    client.reply(from, 'Searching....', id)
                    fetch('https://trace.moe/api/search', {
                            method: 'POST',
                            body: JSON.stringify({
                                image: imgBS4
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                        .then(respon => respon.json())
                        .then(resolt => {
                            if (resolt.docs && resolt.docs.length <= 0) {
                                client.reply(from, "Sorry, I don't know what anime this is", id)
                            }
                            const {
                                is_adult,
                                title,
                                title_chinese,
                                title_romaji,
                                title_english,
                                episode,
                                similarity,
                                filename,
                                at,
                                tokenthumb,
                                anilist_id
                            } = resolt.docs[0]
                            teks = ''
                            if (similarity < 0.92) {
                                teks = '*I have low confidence in this* :\n\n'
                            }
                            teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                            teks += `➸ *Ecchi* : ${is_adult}\n`
                            teks += `➸ *Eps* : ${episode.toString()}\n`
                            teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                            var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                            client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                                client.reply(from, teks, id)
                            })
                        })
                        .catch(() => {
                            client.reply(from, 'Error !', id)
                        })
                } else {
                    client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Here\'s an example bruh!', id)
                }
                break
            case '!quotemaker':
                arg = body.trim().split('?')
                if (arg.length >= 3) {
                    client.reply(from, mess.wait, id)
                    const quotes = encodeURIComponent(arg[1])
                    const author = encodeURIComponent(arg[2])
                    await quotemaker(quotes, author, "random").then(amsu => {
                        client.sendFile(from, amsu, 'quotesmaker.jpg', 'yeh...').catch(() => {
                            client.reply(from, mess.error.Qm, id)
                        })
                    })
                } else {
                    client.reply(from, 'Usage: \n!quotemaker ?text?watermark\n\nEx :\n!quotemaker ?bot life matters?bot', id)
                }
                break
            case '!linkgroup':
                if (!isBotGroupAdmins) return client.reply(from, 'Bot should be an admin in the group', id)
                if (isGroupMsg) {
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
                } else {
                    client.reply(from, 'This command can only be used in groups!', id)
                }
                break
            case '!bc':
                if (!isOwner) return client.reply(from, 'This command is only for Owner bot!', id)
                let msg = body.slice(4)
                const chatz = await client.getAllChatIds()
                for (let ids of chatz) {
                    var cvk = await client.getChatById(ids)
                    if (!cvk.isReadOnly) await client.sendText(ids, `[ Broadcast ]\n\n${msg}`)
                }
                client.reply(from, 'Broadcast Success!', id)
                break
            case '!adminlist':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                let mimin = ''
                for (let admon of groupAdmins) {
                    mimin += `➸ @${admon.replace(/@c.us/g, '')}\n`
                }
                await client.sendTextWithMentions(from, mimin)
                break
            case '!ownergroup':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                const Owner_ = chat.groupMetadata.owner
                await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
                break
            case '!mentionall':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
                const groupMem = await client.getGroupMembers(groupId)
                let hehe = '╔══✪〘 Mention All 〙✪══\n'
                for (let i = 0; i < groupMem.length; i++) {
                    hehe += '╠➥'
                    hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehe += '╚═〘 BOT 〙'
                await client.sendTextWithMentions(from, hehe)
                break
            case '!kickall':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
                const isGroupOwner = sender.id === chat.groupMetadata.owner
                if (!isGroupOwner) return client.reply(from, 'This command can only be used by the Owner group', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Bot should be an admin in the group', id)
                const allMem = await client.getGroupMembers(groupId)
                for (let i = 0; i < allMem.length; i++) {
                    if (groupAdmins.includes(allMem[i].id)) {
                        console.log('Upss this is Admin group')
                    } else {
                        await client.removeParticipant(groupId, allMem[i].id)
                    }
                }
                client.reply(from, 'Succes kick all member', id)
                break
            case '!leaveall':
                if (!isOwner) return client.reply(from, 'This command is only for bot Owner', id)
                const allChats = await client.getAllChatIds()
                const allGroups = await client.getAllGroups()
                for (let gclist of allGroups) {
                    await client.sendText(gclist.contact.id, `Sorry bots are cleaning, total active chat is: ${allChats.length}`)
                    await client.leaveGroup(gclist.contact.id)
                }
                client.reply(from, 'Success leave all group!', id)
                break
            case '!clearall':
                if (!isOwner) return client.reply(from, 'This command is only for bot Owner', id)
                const allChatz = await client.getAllChats()
                for (let dchat of allChatz) {
                    await client.deleteChat(dchat.id)
                }
                client.reply(from, 'Succes clear all chat!', id)
                break
            case '!add':
                const orang = args[1]
                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (args.length === 1) return client.reply(from, 'To use this feature, send a command *!add* 628xxxxx', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Bot should be an admin in the group', id)
                try {
                    await client.addParticipant(from, `${orang}@c.us`)
                } catch {
                    client.reply(from, mess.error.Ad, id)
                }
                break
            case '!kick':
                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
                if (!isBotGroupAdmins) return client.reply(from, 'Bot should be an admin in the group', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'To use this feature, send a command *!kick* @tagmember', id)
                await client.sendText(from, `Accepted, ${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                    await client.removeParticipant(groupId, mentionedJidList[i])
                }
                break
            case '!leave':
                if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
                await client.sendText(from, 'Sayonara').then(() => client.leaveGroup(groupId))
                break
            case '!promote':
                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (!isGroupAdmins) return client.reply(from, 'This feature can only be used by group admins', id)
                if (!isBotGroupAdmins) return client.reply(from, 'This feature can only be used when the bot becomes admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'To use this feature, send a command *!promote* @tagmember', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Sorry, this command can only be used for 1 user.', id)
                if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Sorry, the user is already an admin.', id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Accepted, promote @${mentionedJidList[0]}.`)
                break
            case '!demote':
                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (!isGroupAdmins) return client.reply(from, 'This feature can only be used by group admins', id)
                if (!isBotGroupAdmins) return client.reply(from, 'This feature can only be used when the bot becomes admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'To use this feature, send a command *!demote* @tagadmin', id)
                if (mentionedJidList.length >= 2) return client.reply(from, 'Sorry, this command can only be used for 1 user.', id)
                if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Sorry, that user is not an admin.', id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, `Accepted, demote @${mentionedJidList[0]}.`)
                break
            case '!join':
                if (args.length < 2) return client.reply(from, 'Send command *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla', id)
                const link = args[1]
                // Use it to limite max group
                // const tGr = await client.getAllGroups()
                // Use it to restrict minimum user needed
                // const minMem = 30
                const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
                const check = await client.inviteInfo(link)
                if (!isLink) return client.reply(from, 'Is this a link? 👊🤬', id)
                // if (tGr.length > 15) return client.reply(from, 'Sorry, the number of groups is maxed out!', id)
                // if (check.size < minMem) return client.reply(from, 'Group members do not exceed 30, bots cannot enter', id) 
                if (check.status === 200) {
                    await client.joinGroupViaLink(link).then(() => client.reply(from, 'The boat will enter soon!', id))
                } else {
                    client.reply(from, 'Invalid group link!', id)
                }
                break
            case '!delete':

                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (!isOwner) {
                    if (!isGroupAdmins) return client.reply(from, 'This feature can only be used by group admins', id)
                }
                if (!quotedMsg) return client.reply(from, 'Wrong!!, send command *!delete [tagmessagebot]*', id)
                if (!quotedMsgObj.fromMe) return client.reply(from, "Wrong!!, Bot can't delete another user's chat!", id)
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                break
            case '!getses':
                if (!isOwner) return client.reply(from, 'This command is only for bot Owner', id)
                const sesPic = await client.getSnapshot()
                client.sendFile(from, sesPic, 'session.png', 'Neh...', id)
                break
            case '!lyrics':
                if (args.length == 1) return client.reply(from, "Send the command *!lyrics [optional]*, for example *!lyrics I'm not a doll*", id)
                const lagu = body.slice(7)
                const lirik = await liriklagu(lagu)
                client.reply(from, lirik, id)
                break
            case '!listblock':
                if (!isOwner) return client.reply(from, 'This command is only for bot Owner', id)
                let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
                for (let i of blockNumber) {
                    hih += `➸ @${i.replace(/@c.us/g,'')}\n`
                }
                client.sendTextWithMentions(from, hih, id)
                break
            case '!husbu':
                const diti = fs.readFileSync('./lib/husbu.json')
                const ditiJsin = JSON.parse(diti)
                const rindIndix = Math.floor(Math.random() * ditiJsin.length)
                const rindKiy = ditiJsin[rindIndix]
                client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
                break
            case '!waifu':
                await waifuR(res => {
                    client.sendFileFromUrl(from, res.background_image, 'thumbnail.jpg', `➸ *Name* : ${res.name}\n➸ *Anime* : ${res["appears_in"]} Min \n\n *Description* : ${res.description}`, id)
                })
                break
            case '!randomhentai':
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'The NSFW command has not been activated in this group group!', id)
                    const hentaifile = await randomNimek('hentai')
                    client.sendFile(from, hentaifile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(hentaifile);
                    });
                    break
                } else {
                    const hentaifile = await randomNimek('hentai')
                    client.sendFile(from, hentaifile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(hentaifile);
                    });
                }
                break
            case '!randomnsfwneko':
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'The NSFW command has not been activated in this group group!', id)
                    const nsfwnekofile = await randomNimek('nsfwneko')
                    client.sendFile(from, nsfwnekofile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(nsfwnekofile);
                    });
                    break
                } else {
                    const nsfwnekofile = await randomNimek('nsfwneko')
                    client.sendFile(from, nsfwnekofile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(nsfwnekofile);
                    });
                }
                break
            case '!randomtrap':
                if (isGroupMsg) {
                    if (!isNsfw) return client.reply(from, 'The NSFW command has not been activated in this group group!', id)
                    const trapfile = await randomNimek('trap')
                    client.sendFile(from, trapfile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(trapfile);
                    });
                    break
                } else {
                    const trapfile = await randomNimek('trap')
                    client.sendFile(from, trapfile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                        fs.unlink(trapfile);
                    });
                }
                break
            case '!randomyuri':
                const yurifile = await randomNimek('yuri')
                client.sendFile(from, yurifile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(yurifile);
                });
                break
            case '!randomdva':
                const dvafile = await randomNimek('dva')
                client.sendFile(from, dvafile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(dvafile);
                });
                break
            case '!randomhug':
                const hugfile = await randomNimek('hug')
                client.sendFile(from, hugfile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(hugfile);
                });
                break
            case '!randomneko':
                const nekofile = await randomNimek('neko')
                client.sendFile(from, nekofile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(nekofile);
                });
                break
            case '!randombaguette':
                const baguettefile = await randomNimek('baguette')
                client.sendFile(from, baguettefile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(baguettefile);
                });
                break
            case '!randomanime':
                const animefile = await randomNimek('anime')
                client.sendFile(from, animefile, 'thumbnail.jpg', 'Enjoy!!', id).then(t => {
                    fs.unlink(animefile);
                });
                break
            case '!inu':
                const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg", "https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg", "https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg", "https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg", "https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg", "https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg", "https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg", "https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg", "https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg", "https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg", "https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg", "https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg", "https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg", "https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg", "https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg", "https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg", "https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg", "https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg", "https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg", "https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg", "https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg", "https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg", "https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg", "https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg", "https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg", "https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg", "https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg", "https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg", "https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg", "https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg", "https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg", "https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg", "https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg", "https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg", "https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg", "https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg", "https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg", "https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg", "https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg", "https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg", "https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg", "https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg", "https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg", "https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg", "https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg", "https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg", "https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg", "https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg", "https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg", "https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg", "https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg", "https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg", "https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg", "https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg", "https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg", "https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg", "https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg", "https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg", "https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg", "https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg", "https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg", "https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg", "https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg", "https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg", "https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg", "https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg", "https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg", "https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg", "https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg", "https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg", "https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg", "https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg", "https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg", "https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg", "https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg", "https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg", "https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg", "https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg", "https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg", "https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg", "https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg", "https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg", "https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg", "https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg", "https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg", "https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg", "https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg", "https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg", "https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg", "https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg", "https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg", "https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg", "https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg", "https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg", "https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg", "https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg", "https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg", "https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg", "https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg", "https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
                let kya = list[Math.floor(Math.random() * list.length)]
                client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
                break
            case '!neko':
                q2 = Math.floor(Math.random() * 900) + 300;
                q3 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(from, 'http://placekitten.com/' + q3 + '/' + q2, 'neko.png', 'Neko ')
                break
            case '!meme':
                const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
                const {
                    postlink, title, subreddit, url, nsfw, spoiler
                } = response.data
                client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                break
            case '!help':
                client.sendText(from, help)
                break
            case '!readme':
                client.reply(from, readme, id)
                break
            case '!lang':
                client.reply(from, langCode, id)
                break
            case '!info':
                client.reply(from, "https://github.com/im-Amitto/whatsapp-bot", id)
                break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}