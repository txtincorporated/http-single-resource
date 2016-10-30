const http = require('http');
const url = require('url');
const fs = require('fs');
const sander = require('sander');
// const path = require('path');
const requestHandlers = require('./requestHandlers');

function start(request, method) {

  function onRequest(request, response, data) {
    const pathname = url.parse(request.url).pathname; 
    const method = request.method;
    // const body = JSON.parse(request.body);
    // console.log('reqBody: ', request.body);
    const body = request.on('data', (chunk) => {
      var book = [];
      book.push(chunk);
      book = Buffer.concat(book).toString();
      console.log('ln19 body: ', book);
      return book;
    });

    if(pathname === '/favicon.ico') {
      response.setHeader('content-type', 'image/x-icon');
      response.statusCode = 200;
      const favicon = fs.createReadStream('favicon.ico');
      favicon.pipe(response);
      return;
    }

    if (pathname.substr(4, 6) !== '/store') {
      console.log('UNAUTHORIZED');
      response.write('404 Not Found. Please visit localhost:8888/lib/store for a list of available documents.');
      response.end();
      return;
    };

    console.log('Request for ' + pathname + ' received');
    console.log(method);
    
    switch(method) {
    case 'GET': 
      console.log('Method is GET.');
      const pathArray = pathname.split('/');
      const dirThing = (pathname) => {
        sander.readdir(pathname)
          .then((data) => {
            response.write('You requested ' + pathname.substr(1) + '\n');
            data.forEach((el) => {
              response.write(el + '\n');
            });
            response.end();
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const fileThing = (pathname) => {
        sander.readFile(pathname)
          .then((data) => {
            response.write('You requested ' + pathname.substr(1) + '\n');
            response.write(data);
            response.end();
          });
      };

      if (pathArray[pathArray.length - 2] == 'store') {
        fileThing('.' + pathname);
        return;
      }
      dirThing('.' + pathname);
      break;
    case 'POST': 
      request.on('data', (chunk) => {
        var postBook = [];
        var bookObj = null;
        var file;
        console.log('Method is POST.');
        postBook.push(chunk);
        postBook = Buffer.concat(postBook).toString();
        console.log(postBook);
        bookObj = JSON.parse(postBook);
        var bookName = bookObj.title;
        var fileName = bookName.split(' ').join('_');
        file = path.join('.' + pathname, fileName + '.json');
        fs.writeFile(file, book, (err) => {
          if(err) {
            throw err;
          } else {
            cb(null, bookName);
          }
        });
      });
      response.write('File uploaded.');
      response.end();
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
      sander.readFile('.' + pathname)
        .then((data, body) => {
          putBook = body;
          console.log('putBook: ' + putBook);
          return putBook;
        })
        .then((data, body) => {
          var edit = [];
          var bookObj = null;
          var editObj = null;
          console.log('Method is PUT.');
          console.log('body: ', body);
          edit.push(chunk);
          console.log('pathname: ' + pathname);
          console.log('edit requested: ' + edit);
          edit = Buffer.concat(edit).toString();
          editObj = JSON.parse(edit);
          console.log('editObj: ' + editObj);
          // putBook = fs.readFile('.' + pathname);
          bookOjb = JSON.parse(putBook);
          // bookOjb = putBook;
          console.log('putBook: ' + putBook);
          console.log('bookObj: ' + bookObj);
          console.log('editObj: ' + editObj);
          Object.keys(editObj).forEach((key) => {
            bookObj[key] = editObj[key];
            console.log('New version: ' + bookObj);
          });
          response.write(`Your requested change: ` + edit);
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
