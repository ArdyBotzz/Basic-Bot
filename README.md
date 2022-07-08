# Basic-Bot
whatsapp web response code or logarithm 

# Informasi
Ini adalah basic kode/ kode dasar dari logaritma sebuah responsif whatsapp web, kami memiliki ketergantungan kepada beberapa modulz contohnya baileys terimakasih kepada [@baileys](https://github.com/adiwajshing/Baileys/) dan lain"

# Instalasi
 Langkah awal kalian perlu membuat folder kosong contoh lain saya membuat folder dengan nama ``` basic ``` silahkan ketik command di bawah
```bash
$ mkdir basic && cd basic
```

Kemudian lanjut untuk membuat file panggilan seperti ``` index.js / main.js ``` nama panggilan terserah anda

```bash
$ mkdir index.js
```

Kemudian silahkan salin kode di bawah lalu tempel kan ke file panggilan anda
```js
import baileys from '@adiwajshing/baileys'
import P from "pino"
import {
    Boom
} from '@hapi/boom'
import * as fs from 'fs'
import module from 'module'
import moment from 'moment-timezone'

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
    })
    
    
}
for (let s of sessionDb) {
    connectToWhatsApp(s)
}    
```

Kode di atas adalah suatu pemanggil atau lebih tepatnya kode dasar untuk login atau create sesi sebuat whatsapp web

Apabila sudah, lanjut ke langka selanjutnya adalah buat file dengan nama ``` paclage.json ```

```bash 
$ mkdir package.json
```

Jika sudah tempelkan kode di bawah ini

```json
{
    "scripts": {
        "start": "node index.js" // ini tergantung pada nama panggilan file utama anda
    },
    "name": "Basic-Bot",
    "description": "whatsapp web response code or logarithm",
    "version": "1.0.0",
    "type": "module",
    "dependencies": {
        "@adiwajshing/baileys": "^4.2.0",
        "@adiwajshing/keyed-db": "^0.2.4",
        "moment-timezone": "^0.5.34",
        "qrcode-terminal": "^0.12.0"
  }
}
```

Jika sudah kembali ke terminal anda lalu ketik satu per satu dan jalankan kode di bawah

```js
$ cd basic
$ yarn //Jika menggunakan yarn 
$ node .
```

Jika sudah anda telah memasuki fase terakhir yaitu scan barcode
Anda bisa menyiapkan 2 perangkat lalu scan

Apabila code 
``` opened connection ```

Maka selesai 

# Catatan
Anda bisa lihat informasi lebih lanjut di github kami
