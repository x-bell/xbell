import * as http from 'node:http';

export const get = (url: string) => {
  return new Promise<{ body: string; contentType?: string } >((resolve, reject)=> {
    http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      if (statusCode !== 200) {
        const err = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        // @ts-ignore
        err.statusCode = statusCode;
        reject(err);
      }
      res.setEncoding('utf8');
      let rawData = ''
      
      res.on('data', (chunk) => {
        rawData += chunk;
      });
  
      res.on('end', () => {
        resolve({
          body: rawData,
          contentType,
        });
      })
    }).on('error', (err) => {
      // @ts-ignore
      err.statusCode = 504;
      reject(err);
    })
  })
}
