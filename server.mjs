import http from 'node:http';
import { readFile } from 'node:fs/promises';
const assets = new Map([['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']], ['/styles.css', ['styles.css', 'text/css']], ['/script.js', ['script.js', 'text/javascript']]]);
http.createServer(async (req, res) => {
  const asset = assets.get(new URL(req.url, 'http://localhost').pathname);
  if (!asset) { res.writeHead(404); res.end('Not found'); return; }
  try { const data = await readFile(new URL(`./dist/${asset[0]}`, import.meta.url)); res.writeHead(200, {'Content-Type': `${asset[1]}; charset=utf-8`, 'Cache-Control': 'no-store'}); res.end(data); }
  catch { res.writeHead(500); res.end('Unable to load page'); }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
