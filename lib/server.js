const http = require('http');
const url = require('url');
const fs = require('fs');
const sander = require('sander');
const requestHandlers = require('./requestHandlers');

function start(request, method) {

  function onRequest(request, response) {
    const pathname = url.parse(request.url).pathname; 
    const method = request.method;
    console.log('Request for ' + pathname + ' received');
    console.log(method);
    
    switch(method) {
    case 'GET': 
      console.log('Method is GET.');
      const pathArray = pathname.split('/');
      const dirThing = (pathname) => {
        sander.readdir(pathname)
          .then((data) => {
            data.forEach((el) => {
              response.write(el);
            });
            response.write('You requested' + pathname);
            response.end();
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const fileThing = (pathname) => {
        sander.readFile(pathname)
          .then((data) => {
            response.write('You requested' + pathname);
            response.write(data);
            response.end();
          });
      };

      if (pathArray[pathArray.length - 2] == 'store') {
        fileThing('.' + pathname);
        return;
      }
      dirThing('.' + pathname);
      return;
      break;
    case 'POST': 
      console.log('Method is POST.');
      response.write('Method is POST.');
      response.end();
      break;
    case 'PUT': 
      console.log('Method is PUT.');
      response.write('Method is PUT.');
      response.end();
      break;
    case 'DELETE':
      console.log('Method is DELETE.');
      response.write('Method is DELETE.');
      response.end();
      break;
    default:
      console.log('Method is unsupported.');
      response.write(`405 ${request.method} METHOD NOT ALLOWED`);
      response.end();
    }
  }

  http.createServer(onRequest).listen(8888);
  console.log('Server has started.');
}

exports.start = start;
