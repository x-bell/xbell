import { test } from 'xbell';

test.browser('render screenshot to browser img elements', async ({ page }) => {
  document.write('hello xbell');
  const buffer = await page.screenshot();
  const img = document.createElement('img')!;
  const file = new File([buffer], 'screenshot.png', { type: 'image/png' });
  const fr = new FileReader();
  fr.onload = function () {
    img.src = fr.result as string;
    document.body.appendChild(img);
  }
  fr.readAsDataURL(file);
});


test.browser('trigger click', async ({ page, fn, expect }) => {
  const btn = document.createElement('button');
  btn.innerText = 'button';
  btn.className = 'btn';
  const handleClick = fn();
  btn.onclick = handleClick;
  document.body.appendChild(btn);

  await page.getByClass('btn').click();

  expect(handleClick).toHaveBeenCalled();
});

test.browser('screen shot', async ({ page, expect }) => {
  await import('./page');
  await expect(page).toMatchScreenshot({ name: 'page-screenshot' });
});
