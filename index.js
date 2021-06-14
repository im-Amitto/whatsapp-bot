const {
    create,
    Client
} = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')

const start = async (client = new Client()) => {
    console.log('[SERVER] Server Started!')
    // Force it to keep the current session
    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
    // listening on message
    client.onMessage((async (message) => {
        client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })
        msgHandler(client, message)
    }))

    client.onGlobalParticipantsChanged((async (heuh) => {
        await welcome(client, heuh)
        //left(client, heuh)
    }))

    client.onAddedToGroup(((chat) => {
        let totalMem = chat.groupMetadata.participants.length
        // Minimum members needed to join group
        if (totalMem < 10) { 
        client.sendText(chat.id, `Hey, the members are only ${totalMem}, if you want to invite bots, the minimum number of member is 10`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
        } else {
        client.sendText(chat.groupMetadata.id, `Hello group members *${chat.contact.name}* thank you for inviting this bot, to view the menu please send *!help*`)
        client.sendText(chat.groupMetadata.id, `Use *!leave* coammnd to kick out bot permanently`)
        }
    }))

    /*client.onAck((x => {
        const { from, to, ack } = x
        if (x !== 3) client.sendSeen(to)
    }))*/

    // listening on Incoming Call
    client.onIncomingCall((async (call) => {
        await client.sendText(call.peerJid, "Sorry, Bot can't receive calls. call = block!")
            .then(() => client.contactBlock(call.peerJid))
    }))
}

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))