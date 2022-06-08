import { createDecorator } from './custom'

const NoError = createDecorator(async (ctx, next) => {
  const errors = [];
  ctx.page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  await next();

  ctx.expect(errors.length).toBe(0);
});

// TODO:
const Snaptshot = createDecorator(async (ctx, next) => {
  await next();
})

export const Expect = {
  Console: {
    NoError,
  },
  Snaptshot,
};

