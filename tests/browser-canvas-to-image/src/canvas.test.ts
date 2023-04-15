import { test } from 'xbell';

test.browser('canvas snapshot', async ({ expect, sleep }) => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, 100, 100);
  const blob = await new Promise<Blob>(resolve => canvas.toBlob((blob) => {
    resolve(blob!);
  }));
  const uint8Array = new Uint8Array(await blob.arrayBuffer());
  await expect(uint8Array).toMatchImageSnapshot({ name: 'cavans-to-image' });
});
