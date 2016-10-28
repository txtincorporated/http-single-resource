var sander = require('sander');

function get(response) {
  //either
  sander.readdir();
  //or
  sander.readFile();
  console.log('Request handler "hello" has been called.');
  response.writeHead(200, {'content-type': 'text/plain'});
  response.write(data);
  response.end();  
};

function post(response, data) {
  console.log('Request handler "goodbye" has been called');
  response.writeHead(200, {'content-type': 'text/plain'});
  response.write(data);
  response.end();
};

function put(response, data) {
  console.log('Request handler "goodbye" has been called');
  response.writeHead(200, {'content-type': 'text/plain'});
  response.write(data);
  response.end();  
};

function del(request, response) {
  console.log('Request handler "goodbye" has been called');
  response.writeHead(200, {'content-type': 'text/plain'});
  response.write(data);
  response.end();
};

function fourohfour(href, response) {
  console.log('Request handler "fourohfour" has been called');
  response.writeHead(200, {'content-type': 'text/plain'});
  response.write(data + `\nSorry, but ${href} is not a URL we know about.`);
  response.end();
};

exports.get = get;
exports.post = post;
exports.put = put;
exports.del = del;
exports.fourohfour = fourohfour;