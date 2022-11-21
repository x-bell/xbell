// const NetworkSpeed = require('network-speed');
import * as http from 'node:http';
import * as https from 'node:https';
import * as net from 'node:net';

function getProcotol(url: string) {
  const urlObj = new URL(url);
  return urlObj.protocol === 'http:' ? http : https
}

export function getPort(minPort: number, maxPort: number): Promise<number> {
  function _getPortImp(minPort: number, maxPort: number, resolve: (num: number) => void, reject: (reson: any) => void) {
    const server = net.createServer();
    server.once('error', (err) => {
      if ((err as any).code === 'EADDRINUSE') {
        if (minPort >= maxPort) reject(err);
        else _getPortImp(minPort + 1, maxPort, resolve, reject);
        return 
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(minPort);
    });

    server.listen(minPort);
  }
  return new Promise((resolve, reject) => {
    return _getPortImp(minPort, maxPort, resolve, reject);
  });
}

interface CheckDownloadSpeedOptions {
  timeout: number;
  maxDownloadByteSize: number;
}

export function checkDownloadSpeed(downloadLink: string, {
  maxDownloadByteSize,
  timeout,
}: CheckDownloadSpeedOptions) {
  const protocol = getProcotol(downloadLink);
  let startTime: number;
  
  return new Promise((resolve, reject) => {

    const finished = () => {
      const endTime = new Date().getTime();
      const duration = (endTime - startTime) / 1000;
      const bitsLoaded = maxDownloadByteSize * 8;
      const bps = +(bitsLoaded / duration).toFixed(2);
      const kbps = +(bps / 1000).toFixed(2);
      const mbps = (kbps / 1000).toFixed(2);
      resolve({ bps, kbps, mbps });
    };

    const req = protocol.get(downloadLink, (response) => {
      let totalByteLength = 0;
      response.addListener('data', (buffer) => {
        if (!startTime) {
          startTime = Date.now();
        }
        totalByteLength += buffer.byteLength;

        if (totalByteLength >= maxDownloadByteSize) {
          req.destroy();
          response.removeAllListeners();
          finished();
        }
      }
    );

    response.once('end', () => {
        response.removeAllListeners();
        if (response.statusCode === 302) {
          checkDownloadSpeed(response.headers.location as string, {
            maxDownloadByteSize,
            timeout
          }).then(resolve);
        } else {
          finished();
        }
      });
    });

    setTimeout(() => {
      req.destroy();
      reject(new Error(`Timeout: more than ${timeout} ms`));
    }, timeout);

  })
}


// async function getNetworkDownloadSpeed(download: ) {
//   // const baseUrl = 'https://cnpmjs.org/mirrors/playwright/builds/chromium/1000/chromium-linux.zip';
//   const maxDownloadByteSize = 1024 * 1024;

//   const speed = await checkDownloadSpeed(baseUrl, {
//     maxDownloadByteSize: maxDownloadByteSize,
//     timeout: 1000 * 10
//   });
//   return baseUrl;
// }


// ;(async () => {
//   const source = await Promise.race(sources.map(source => getNetworkDownloadSpeed(source)));
//   console.log('source', source);
//   process.exit(0);
// })();