type RGB = [number, number, number];
type HEX = string;

const FE_END_FLAG = '\x1b[39m';
const BG_END_FLAG = '\x1b[49m';

const AnsiColors = {
  reset: ['\x1b[0m', '\x1b[0m'],
  bold: ['\x1b[1m', '\x1b[22m'],
  dim: ['\x1b[2m', '\x1b[22m'],
  italic: ['\x1b[3m', '\x1b[23m'],
  underline: ['\x1b[4m', '\x1b[24m'],
  inverse: ['\x1b[7m', '\x1b[27m'],
  hidden: ['\x1b[8m', '\x1b[28m'],
  strikethrough: ['\x1b[9m', '\x1b[29m'],
  black: ['\x1b[30m', FE_END_FLAG],
  red: ['\x1b[31m', FE_END_FLAG],
  green: ['\x1b[32m', FE_END_FLAG],
  yellow: ['\x1b[33m', FE_END_FLAG],
  blue: ['\x1b[34m', FE_END_FLAG],
  magenta: ['\x1b[35m', FE_END_FLAG],
  cyan: ['\x1b[36m', FE_END_FLAG],
  white: ['\x1b[37m', FE_END_FLAG],
  gray: ['\x1b[90m', FE_END_FLAG],
  bgBlack: ['\x1b[40m', BG_END_FLAG],
  bgRed: ['\x1b[41m', BG_END_FLAG],
  bgGreen: ['\x1b[42m', BG_END_FLAG],
  bgYellow: ['\x1b[43m', BG_END_FLAG],
  bgBlue: ['\x1b[44m', BG_END_FLAG],
  bgMagenta: ['\x1b[45m', BG_END_FLAG],
  bgCyan: ['\x1b[46m', BG_END_FLAG],
  bgWhite: ['\x1b[47m', BG_END_FLAG],
} as const;

type AnsiColorsKeys = keyof typeof AnsiColors;

type MethodKeys = 'rgb' | 'hex' | 'bgRgb' | 'bgHex' | 'gradient' | 'rainbow';

const RainbowColor = {
  Start: '#11b8db',
  End: '#df76cd',
};

function addColorByFlag(str: string, startFlag: string, endFlag: string): string {
  return `${startFlag}${startFlag === endFlag ? str : removeEndFlag(str, startFlag, endFlag)}${endFlag}`;
}

function addColorByType(str: string, type: AnsiColorsKeys): string {
  const [startFlag, endFlag] = AnsiColors[type];
  return addColorByFlag(str, startFlag, endFlag);
};

function addColorByRgb(str: string, [r, g, b]: RGB, isBg = false): string {
  return addColorByFlag(str, '\x1b[38;2;' + `${r};${g};${b}m`, isBg ? BG_END_FLAG : FE_END_FLAG);
}

function addColorByHex(str: string, hex: HEX, isBg = false): string {
  const rgb = hexToRgb(hex);
  return addColorByRgb(str, rgb, isBg);
}

function addColorByGradient(str: string, startColor: HEX | RGB, endColor: HEX | RGB): string {
  if (!startColor || !endColor) {
    throw new Error('@xbell/color: gradient requires start/end color');
  }
  const length = str.length;
  const startRGB = typeof startColor === 'string' ? hexToRgb(startColor) : startColor;
  const endRGB = typeof endColor === 'string' ? hexToRgb(endColor) : endColor;
  let ret = '';
  str.split('').map((char, charIndex) => {
    const [r, g, b] = startRGB.map((s, idx) => Math.floor(s + (endRGB[idx] - s) * charIndex / (length - 1)));
    ret += "\x1b[38;2;" + `${r};${g};${b}m${char}` + FE_END_FLAG
  });
  return ret;
}

function addColor(str: string, method: MethodKeys, args: any[] = []): string {
  console.log('addColor', method, str);
  switch (method) {
    case 'hex':
      return addColorByHex(str, args[0], false);
    case 'bgHex':
      return addColorByHex(str, args[0], true);
    case 'rgb':
      return addColorByRgb(str, args as [number, number, number], false);
    case 'bgRgb':
      return addColorByRgb(str, args as [number, number, number], true);
    case 'gradient':
      return addColorByGradient(str, args[0] as RGB | HEX, args[1] as RGB | HEX);
    case 'rainbow':
      return addColorByGradient(str, RainbowColor.Start, RainbowColor.End)
    default:
      return addColorByType(str, method);
  }
}

const removeEndFlag = (
  str: string,
  startFlag: string,
  endFlag: string,
): string => {
  const endFlagIndex = str.indexOf(endFlag, startFlag.length)
  if (endFlagIndex === -1) {
    return str;
  }

  const endFlagLeftStr = str.substring(0, endFlagIndex) + startFlag;
	const endFlagRightStr = str.substring(endFlagIndex + endFlag.length);
	return endFlagLeftStr + removeEndFlag(endFlagRightStr, startFlag, endFlag);
};

interface Color extends Record<AnsiColorsKeys, Color> {
  (str: any): string;
  gradient(start: HEX | RGB, end: HEX | RGB): Color;
  rainbow: Color;
  rgb(r: number, g: number, b: number): Color;
  bgRgb(r: number, g: number, b: number): Color;
  hex(hex: string): Color;
  bgHex(hex: string): Color;
}

const NEED_ARGS_METHODS = new Set<string | symbol>([
  'rgb',
  'hex',
  'gradient',
  'bgRgb',
  'bgHex',
]);

const SUPPORT_METHODS = new Set<string | symbol>([
  ...Object.keys(AnsiColors),
  ...NEED_ARGS_METHODS,
  'rainbow'
]);

function hexToRgb(hex: HEX):[number, number, number] {
  hex = hex.startsWith('#') ? hex : `#${hex}`;
  if (hex.length === 4) {
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  }

  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function genColorProxy(method?: MethodKeys, args = []): Color {
  const chain: Array<{ method: MethodKeys; args?: any[]; record?: boolean; }> = method ? [{ method, args }] : [];
  const proxy = new Proxy(() => {}, {
    get(_, propKey) {
      if (!SUPPORT_METHODS.has(propKey)) {
        throw new Error(`@xbell/color: The "${propKey.toString()}" method is not supported.`);
      }
      chain.push({
        method: propKey as MethodKeys,
      });
      return proxy;
    },
    apply(_, __, args) {
      const lastOne = chain[chain.length - 1];
      if (NEED_ARGS_METHODS.has(lastOne?.method) && !lastOne.record) {
        lastOne.args = args;
        lastOne.record = true;
        return proxy;
      }
      const [str] = args;
      return chain.reverse().reduce((acc, type) => addColor(acc, type.method, type.args), String(str));
    },
  }) as unknown as Color;

  return proxy;
}

const color = new Proxy(() => {}, {
  get(_, propKey: MethodKeys) {
    return genColorProxy(propKey);
  },
}) as unknown as Color;

export default color;
