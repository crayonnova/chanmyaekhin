const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3131;
const FILE = path.join(__dirname, 'index.html');

// Live reload: the page listens on /__reload (Server-Sent Events) and reloads when index.html changes.
const clients = new Set();
const reloadScript = `<script>new EventSource('/__reload').onmessage = () => location.reload();</script>`;

let timer;
// Watch the folder, not the file: editors that save by replace would drop a file watcher.
fs.watch(__dirname, (event, name) => {
  if (name !== 'index.html') return;
  clearTimeout(timer); // one save fires several events
  timer = setTimeout(() => clients.forEach((res) => res.write('data: reload\n\n')), 100);
});

http.createServer((req, res) => {
  if (req.url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) { res.writeHead(500); return res.end('Error'); }

    res.writeHead(200, { 'Content-Type': 'text/html', "asdf": "asdf" });
    res.end(data.replace('</body>', `${reloadScript}</body>`));
  });
}).listen(PORT, () => console.log(`Listening at port ${PORT}`));
