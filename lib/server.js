const http = require('http');
const url = require('url');
const fs = require('fs');
const sander = require('sander');
const path = require('path');
const handlers = require('./requestHandlers');

function start(request, method) {

  function onRequest(request, response) {
    request.pathname = url.parse(request.url).pathname; 

    if(request.pathname === '/favicon.ico') {
      response.setHeader('content-type', 'image/x-icon');
      response.statusCode = 200;
      const favicon = fs.createReadStream('favicon.ico');
      favicon.pipe(response);
      return;
    }

    if (request.pathname.substr(4, 6) !== '/store') {
      console.log('UNAUTHORIZED');
      response.write('404 Not Found. Please visit localhost:8888/lib/store for a list of available documents.');
      response.end();
      return;
    }

    var body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if(body) {
        request.body = JSON.parse(body);
        console.log('body: ' + body);
      }
      onEnd(request, response);
    });
  };

  function onEnd(request, response) {
    var method = request.method;

    console.log('Request for ' + request.pathname + ' received');
    console.log(method);
    
    switch(method) {
    case 'GET': 
      handlers.get(request, response);
      break;
    case 'POST': 
      handlers.post(request, response);
      break;
    case 'PUT': 
      handlers.put(request, response);
      break;
    case 'DELETE':
      handlers.del(request, response)
      break;
    default:
      handlers.fourohfour(request, response);
    }
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;
