var sander = require('sander');
var path = require('path');
var fs = require('fs');

function get(request, response) {
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
};

function post(request, response) {
  var file;
  var book = JSON.stringify(request.body);
  console.log(book);
  var bookName = request.body.title;
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
};

function put(request, response) {
  var putBook = null;
  var pathname = request.pathname;
  sander.readFile('.' + pathname)
    .then((data) => {
      var bookObj = JSON.parse(data);
      var editObj = request.body;
      Object.keys(editObj).forEach((key) => {
        bookObj[key] = editObj[key];
      });
      return sander.writeFile('.' + pathname, JSON.stringify(bookObj));
    })
    .then(() => {
      response.write(pathname + 'updated successfully.');
      response.end();
    })
    .catch((err) => {
      console.log('ERROR: ', err);
    });
};

function del(request, response) {
  var filePath = '.' + request.pathname;
  var pathArray = request.pathname.split('/');

  if (pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== 'store') {
    sander.unlink(filePath)
      .then(() => {
        response.write('File successfully deleted. \n', () => {
          response.end(filePath.substr(1) + ' successfully deleted. \n');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    response.write(pathArray[pathArray.length - 1] + ' is not a file.  Please try again. \n');
  }
};

function fourohfour(href, response) {
  console.log('Method is unsupported.');
  response.write(`405 ${request.method} METHOD NOT ALLOWED`);
  response.end();
};

exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.fourohfour = fourohfour;