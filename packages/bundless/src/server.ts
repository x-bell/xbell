
import type { IncomingMessage, ServerResponse } from 'node:http';
import * as http from 'node:http';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ServerContext, ServerMiddleware, ServerOptions } from './types';
// const __filename = fileURLToPath(new URL(import.meta.url));
// const __dirname = path.dirname(__filename);
const options = {
  key: fs.readFileSync(
    path.join(__dirname, '../.cert', 'localhost-privkey.pem')
  ),
  cert: fs.readFileSync(
    path.join(__dirname, '../.cert', 'localhost-cert.pem'),
  )
};

class Server {
  private _cwd: string;
  private _server: ReturnType<typeof http.createServer>;
  private _middlewares: ServerMiddleware[];
  constructor({
    cwd,
  }: ServerOptions) {
    this._middlewares = [];
    this._cwd = cwd;
    this._server = http.createServer(this._serverCallback);
  }

  private _serverCallback = async (req: IncomingMessage, res: ServerResponse) => {
    const ctx: ServerContext = {
      body: undefined,
    };
    const middlewares = this._middlewares.reverse();

    const next = async () => {
      const nextMiddleware = middlewares.pop();
      if (nextMiddleware) {
        await nextMiddleware(ctx, next);
      }
    }

    await next();

    res.end(ctx.body);
  }

  use(middleware: ServerMiddleware) {
    this._middlewares.push(middleware);
  }

  listen(port: number) {
    this._server.listen(port);
  }
}

const server = new Server({
  cwd: process.cwd(),
});

server.use(async (ctx, next) => {
  ctx.body = 'hello xbell';
  await next();
});

server.listen(5566);

