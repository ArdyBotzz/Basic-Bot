import baileys from '@adiwajshing/baileys'
import P from "pino"
import {
    Boom
} from '@hapi/boom'
import * as fs from 'fs'
import module from 'module'
import moment from 'moment-timezone'
import messageUp from './message.js'

let sessionDb = ["./session.json"]

global.require = module.createRequire(import.meta.url)
global.baileys = baileys

async function connectToWhatsApp(session) {
    const {
        state,
        saveState
    } = baileys.useSingleFileAuthState(session)
    const sock = global.sock = baileys.default({
        printQRInTerminal: true,
        logger: P({
            level: 'silent'
        }),
        auth: state
    })
    const store = baileys.makeInMemoryStore({
        logger: P().child({
            level: 'silent',
            stream: 'store'
        })
    })
    store.readFromFile('./DataBase.json')
    setInterval(() => {
        store.writeToFile('./DataBase.json')
    }, 10_000)
    store.bind(sock.ev)
    sock.ev.on("connection.update", update => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== baileys.DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            if (shouldReconnect) {
                for (let s of sessionDb) {
                    connectToWhatsApp(s)
                }
            }
        } else if (connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('creds.update', saveState)
    sock.ev.on('contacts.update', (kontak) => {
        for (let contact of kontak) {
            let id = contact.id
            let name = contact.notify
            if (store && store.contacts) store.contacts[id] = {
                id,
                name
            }
        }
    })

    sock.ev.on('messages.upsert', async (message) => {
      await messageUp(message, sock, store)
    })
    
    
}
for (let s of sessionDb) {
    connectToWhatsApp(s)
}    
    