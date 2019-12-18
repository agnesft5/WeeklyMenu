'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();



app.use(express.static('views'));

https.createServer({
    key: fs.readFileSync('/route/to/key.pem'),
    cert: fs.readFileSync('/route/to/cert.pem')
}, app).listen(443, ()=>{
    console.log('server listen at port 443');
})