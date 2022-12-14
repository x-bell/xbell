
import type { IncomingMessage, ServerResponse } from 'node:http';
import * as http from 'node:http';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath, parse } from 'node:url';
import type { ServerContext, ServerMiddleware, ServerOptions } from './types';
import { resolve } from './resolve';
// const __filename = fileURLToPath(new URL(import.meta.url));
// const __dirname = path.dirname(__filename);
// const options = {
//   key: fs.readFileSync(
//     path.join(__dirname, '../.cert', 'localhost-privkey.pem')
//   ),
//   cert: fs.readFileSync(
//     path.join(__dirname, '../.cert', 'localhost-cert.pem'),
//   )
// };

export class Server {
  static async create(opts: ServerOptions): Promise<Server> {
    const server = new Server(opts);
    server.use(async (ctx, next) => {
      const { pathname } = ctx.request.url;
      if (pathname === '/') {
        const indexHTMLPath = path.join(server.cwd, 'index.html');
        const indexHTML = fs.readFileSync(indexHTMLPath, 'utf-8');
        ctx.setHeader('Content-Type', 'text/html');
        ctx.body = indexHTML;
      } else {
        const isExisted = fs.existsSync(path.join(
          server.cwd,
          '.' + pathname,
        ));
        if (isExisted) {
          const ret = await resolve({
            importer: server.cwd,
            specifier: '.' + pathname,
          });
          if (ret.type === 'file') {
            const fileContent = fs.readFileSync(ret.filename, 'utf-8');
            ctx.setHeader('Content-Type', 'application/javascript');
            ctx.body = fileContent;
          }
        } else {
          ctx.body = 'Not found';
        }
      }

      await next();
    });

    return server;
  }

  public cwd: string;
  private _server: ReturnType<typeof http.createServer>;
  private _middlewares: ServerMiddleware[];
  private constructor({
    cwd,
  }: ServerOptions) {
    this._middlewares = [];
    this.cwd = cwd;
    this._server = http.createServer(this._serverCallback);
  }

  private _serverCallback = async (req: IncomingMessage, res: ServerResponse) => {
    const url = parse(req.url ?? '/');
    const ctx: ServerContext = {
      body: undefined,
      setHeader: (...args) => res.setHeader(...args),
      request: {
        url,
      }
    };
    const middlewares = [...this._middlewares].reverse();

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
    return this;
  }
}

