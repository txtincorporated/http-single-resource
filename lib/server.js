const http = require('http');
const url = require('url');
const fs = require('fs');
const sander = require('sander');
const path = require('path');
const requestHandlers = require('./requestHandlers');

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
    // console.log('ln 23 body: ', book());

    console.log('Request for ' + request.pathname + ' received');
    console.log(method);
    
    switch(method) {
    case 'GET': 
      console.log('Method is GET.');
      const pathArray = request.pathname.split('/');
      const dirThing = (filePath) => {
        sander.readdir(filePath)
          .then((data) => {
            response.write('You requested ' + filePath.substr(1) + '\n');
            data.forEach((el) => {
              response.write(el + '\n');
            });
            response.end();
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const fileThing = (filePath) => {
        console.log('filePath: ' + filePath);
        console.log('pathArray: ', pathArray);
        sander.readFile(filePath)
          .then((data) => {
            response.write('You requested ' + filePath.substr(1) + '\n');
            response.write(data);
            response.end();
          });
      };

      if (pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== 'store') {
        fileThing('.' + request.pathname);
        return;
      }
      dirThing('.' + request.pathname);
      break;
    case 'POST': 
      var file;
      var book = JSON.stringify(request.body);
      console.log('Method is POST.');
      console.log(book);
      var bookName = request.body.title;
      // var fileName = bookName.split(' ').join('_');
      var fileName = bookName.replace(' ', '_');
      file = path.join('.' + request.pathname, fileName + '.json');
      fs.writeFile(file, book, (err) => {
        if(err) {
          throw err;
        } else {
          response.write('File uploaded.');
          response.end();
        }
      });
      break;
    // case 'PUT': 
    //   request.on('data', (data) => {        
    //     console.log(data);
    //     response.write('Method is PUT.\n');
    //     response.write(`You requested to update ${pathname.substr(11)} with ${data}.`);
    //     response.end();
    //   });
    case 'PUT': 
      var putBook = null;
      var pathname = request.pathname;
      sander.readFile('.' + pathname)
        .then((data) => {
          var bookObj = JSON.parse(data);
          var editObj = request.body;
          console.log('Method is PUT.');
          console.log('pathname: ' + pathname);
          console.log('editObj: ' + editObj);
          console.log('bookObj: ' + bookObj);
          Object.keys(editObj).forEach((key) => {
            bookObj[key] = editObj[key];
          });
          console.log('New version: ' + bookObj);
          return sander.writeFile('.' + pathname, JSON.stringify(bookObj));
        })
        .then(() => {
          response.write(pathname + 'updated successfully.');
          response.end();
        })
        .catch((err) => {
          console.log('ERROR: ', err);
        });
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
