var sander = require('sander');
var path = require('path');
var fs = require('fs');

function get(req, res) {
  const pathArray = req.pathname.split('/');
  let body;
  const dirThing = (filePath) => {
    sander.readdir(filePath)
      .then((data) => {
        res.writeHead(200,{'Content-Type': 'application/json'});
        let els = [];
        data.forEach((el) => {
          els.push(el);
        });
        body = JSON.stringify(els);
        res.write(body);
        res.end();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fileThing = (filePath) => {
    sander.readFile(filePath)
      .then((data) => {
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.write(data);
        res.end();
      });
  };

  if (pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== 'store') {
    fileThing('.' + req.pathname);
    return;
  }
  dirThing('.' + req.pathname);
};

function post(req, res) {
  var file;
  var book = JSON.stringify(req.body);
  var bookName = req.body.title;
  let fileName = bookName.replace(/\s/g, '_');
  file = path.join('.' + req.pathname, fileName + '.json');
  fs.writeFile(file, book, (err) => {
    if(err) {
      throw err;
    } else {
      res.writeHead(200,{'Content-Type': 'text/plain'});
      res.write('File uploaded.');
      res.end();
    }
  });
};

function put(req, res) {
  var putBook = null;
  var pathname = req.pathname;
  sander.readFile('.' + pathname)
    .then((data) => {
      var bookObj = JSON.parse(data);
      var editObj = req.body;
      Object.keys(editObj).forEach((key) => {
        bookObj[key] = editObj[key];
      });
      putBook = JSON.stringify(bookObj);
      return sander.writeFile('.' + pathname, JSON.stringify(bookObj));
    })
    .then(() => {
      res.writeHead(200,{'Content-Type': 'application/json'});
      res.write(putBook);
      res.end();
    })
    .catch((err) => {
      console.log('ERROR: ', err);
    });
};

function del(req, res) {
  var filePath = '.' + req.pathname;
  var pathArray = req.pathname.split('/');

  if (pathArray[pathArray.length - 1] && pathArray[pathArray.length - 1] !== 'store') {
    sander.unlink(filePath)
      .then(() => {
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.write('File successfully deleted. \n', () => {
          res.end(filePath.substr(1) + ' successfully deleted. \n');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.write(pathArray[pathArray.length - 1] + ' is not a file.  Please try again. \n');
  }
};

function fourohfour(href, res) {
  console.log('Method is unsupported.');
  res.write(`405 ${req.method} METHOD NOT ALLOWED`);
  res.end();
};

exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.fourohfour = fourohfour;