import * as http from 'http';
import { pipeline } from './pipeline';

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const result = await pipeline(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ path: result }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        if (error instanceof Error) {
          console.error(error);
          res.end(JSON.stringify({ error: error.message }));
        } else {
          res.end(JSON.stringify({ error: 'An unknown error occurred' }));
        }
      }
    });
  } else if (req.method === 'GET' && req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'plain/text' });
    res.end('pong');
  } else {
    res.writeHead(404);
    res.end();
  }
});

const host = 'localhost';
const port = 8080;
server.listen(port, host, () => {
  console.log(`Server listening on port http://${host}:${port}`);
});
