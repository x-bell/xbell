import { test } from 'xbell';

test.browser('User agent is iOS', async ({ expect }) => {
  const { USER_AGENT } = await import('../user-agent');
  expect(navigator.userAgent).toBe(USER_AGENT);
});
