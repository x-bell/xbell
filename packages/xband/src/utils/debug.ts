// import { debug as dbg } from 'debug';
import { flags } from '../flags';

export const debug = (desc: string) => async (message: any) => {
  if (flags.debug) {
    const { default: dbg } = await import('debug')
    dbg(desc)(message)
  }
}
