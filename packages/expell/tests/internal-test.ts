export const test = (description: string, cb: Function) => {
  try {
    cb();
  } catch(error: unknown) {
    console.error(`Case Failed: ${description}\n${error instanceof Error ? error.message: ''}`)
  }
}

