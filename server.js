const http = require('http');
const fs = require('fs');
let html = fs.readFile('./index.html', (err, data) => {
  if (err) throw err;
  html = data;
});
let css = fs.readFile('./style.css', (err, data) => {
  if (err) throw err;
  css = data;
});

http.createServer((req, res) => {
  //res.writeHead(200, {'Content-Type': 'text/html'})
  switch (req.url) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      break;
    case '/style.css':
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
      break;
  }
}).listen(3000, () => console.log('Server on!'));