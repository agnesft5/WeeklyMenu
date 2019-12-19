const express = require('express');
const https = require('https');

const fs = require('fs');
const server = express();



server.use(express.static('public'));

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/weeklydiet.es/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/weeklydiet.es/fullchain.pem')
}, server).listen(80, ()=>{
    console.log('Servidor escuchando en el puerto 80');
})