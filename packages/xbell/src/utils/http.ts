import fetch from 'node-fetch';

export const get = (url: string) => {
  return fetch(url).then(async (res) => {
    return {
      body: await res.arrayBuffer(),
      contentType: res.headers.get('content-type') as string,
    }
  });
}
