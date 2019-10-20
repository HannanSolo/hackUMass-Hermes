// Load modules
const StringDecoder = require('string_decoder').StringDecoder;
var net = require('net');

let trackingServer
let potentialServer

/*
 * Create TCP server for source tracking
 */

 let remainingTrack = '';

 exports.startTrackingServer = (odasStudio) => {

   trackingServer = net.createServer();
   trackingServer.on('connection', handleConnection);

   trackingServer.listen(9000, function() {
     console.log('server listening to %j', trackingServer.address());
   });

   function handleConnection(conn) {
    const express = require('express')
    const morgan = require('morgan')
    const cors = require('cors')
    const app = express()
    app.use(morgan())
    const WebSocket = require('ws')
    const wss = new WebSocket.Server({ port: 8080 })
    wss.on('connection', ws => {
      ws.send(recent_data)
    })
    app.use(cors())
    app.use('/static', express.static('public'))
    const port = 3111
    recent_data = ''
    stringToSend = ''
    app.get('/', (req, res) => res.send(stringToSend))

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
     var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
     console.log('new client connection from %s', remoteAddress);

     conn.on('data', onConnData);
     conn.once('close', onConnClose);
     conn.on('error', onConnError);

     function onConnData(d) {

       var decoder = new StringDecoder();

       // Decode received string
       var stream = remainingTrack + decoder.write(d);
       strs = stream.split("}\n{");
       if(strs.length < 2) {
           remainingTrack = stream;
           return;
       }

       strs.forEach((str,index) => {

           if(index == strs.length-1) {
               remainingTrack = str;
               return;
           }

           if(str.charAt(0) !== '{') {
               str = '{' + str;
           }

           if(str.charAt(str.length-2) !== '}') {
               if(str.charAt(str.length-3)!== '}') {
                   str = str + '}';
               }
           }

           try {
            recent_data = str
            if (recent_data.length > 0){
              d = JSON.parse(recent_data)['src'];
              stringToSend = ''
              toSend = {};
              for (let i = 0; i < d.length; i++){
                if (d[i]['tag'] === 'dynamic'){
                  toSend = d[i];
                  theta = Math.atan2(Number(toSend['y']),Number(toSend['x'])) * 180 / Math.PI;
                  // console.log(theta)
                  stringToSend = stringToSend + theta + ",";
                }
              }
              stringToSend = stringToSend.substring(0, stringToSend.length-1)
              
            }
            
             odasStudio.mainWindow.webContents.send('newTracking',str);
             if(typeof odasStudio.odas.odas_process == 'undefined') {
               odasStudio.mainWindow.webContents.send('remote-online');
             }
           }

           catch(err) {
            //  console.log('');
           }
       });
     }

     function onConnClose() {
       console.log('connection from %s closed', remoteAddress);
       odasStudio.mainWindow.webContents.send('remote-offline');
     }

     function onConnError(err) {
       console.log('Connection %s error: %s', remoteAddress, err.message);
     }
   }

 }


/*
 * Create TCP server for potential sources
 */

 let remainingPot = '';

 exports.startPotentialServer = (odasStudio) => {

   potentialServer = net.createServer();
   potentialServer.on('connection', handlePotConnection);

   potentialServer.listen(9001, function() {
     console.log('server listening to %j', potentialServer.address());
   });

   function handlePotConnection(conn) {
     var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
     console.log('new client connection from %s', remoteAddress);

     conn.on('data', onConnData);
     conn.once('close', onConnClose);
     conn.on('error', onConnError);

     function onConnData(d) {

       var decoder = new StringDecoder();

       // Decode received string
       var stream = remainingPot + decoder.write(d);
       strs = stream.split("}\n{");
       if(strs.length < 2) {
           remainingPot = stream;
           return;
       }

       strs.forEach((str,index) => {

           if(index == strs.length-1) {
               remainingPot = str;
               return;
           }

           try {

               if(str.charAt(0) !== '{') {
                   str = '{' + str;
               }

               if(str.charAt(str.length-2) !== '}') {
                   if(str.charAt(str.length-3)!== '}') {
                       str = str + '}';
                   }
               }
             odasStudio.mainWindow.webContents.send('newPotential',str);
             if(typeof odasStudio.odas.odas_process == 'undefined') {
               odasStudio.mainWindow.webContents.send('remote-online');
             }
           }

           catch(err) {
             console.log('Window was closed');
           }
       });

     }

     function onConnClose() {
       console.log('connection from %s closed', remoteAddress);
       odasStudio.mainWindow.webContents.send('remote-offline');
     }

     function onConnError(err) {
       console.log('Connection %s error: %s', remoteAddress, err.message);
     }
   }
 }
