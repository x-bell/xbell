import { Server } from '@xbell/bundless';

const server = await Server.create({
  cwd: process.cwd(),
});

server.listen(5566);
