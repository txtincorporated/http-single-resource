const http = require('http');
const url = require('url');
const fs = require('fs');
const sander = require('sander');
const path = require('path');
const handlers = require('./requestHandlers');


function onRequest(req, res) {
  req.pathname = url.parse(req.url).pathname; 

  if(req.pathname === '/favicon.ico') {
    res.setHeader('content-type', 'image/x-icon');
    res.statusCode = 200;
    const favicon = fs.createReadStream('favicon.ico');
    favicon.pipe(res);
    return;
  }

  if (req.pathname.substr(4, 6) !== '/store') {
    console.log('UNAUTHORIZED');
    res.write('404 Not Found. Please visit localhost:8888/lib/store for a list of available documents.');
    res.end();
    return;
  }

  var body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    if(body) {
      req.body = JSON.parse(body);
      // console.log('req.body: ' + body);
    }
    onEnd(req, res);
  });
};

function onEnd(req, res) {
  var method = req.method;

  // console.log('Request for ' + req.pathname + ' received');
  console.log(method);
  
  switch(method) {
  case 'GET': 
    handlers.get(req, res);
    break;
  case 'POST': 
    handlers.post(req, res);
    break;
  case 'PUT': 
    handlers.put(req, res);
    break;
  case 'DELETE':
    handlers.del(req, res);
    break;
  default:
    handlers.fourohfour(req, res);
  }
}

module.exports = http.createServer(onRequest);
