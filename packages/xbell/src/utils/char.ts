const EMOJI_REGEX = /\p{Emoji}/u;
// const EMOJI_GLOBAL_REGEX = ;


// function isEmoji(content: string): boolean {
//   return EMOJI_REGEX.test(content)
// }

// simple check
export function isChinese(s: string) {
  return s.charCodeAt(0) > 127 || s.charCodeAt(0) === 94
}

export function getStringDisplayLength(str: string) {
  str = str.replace(/\p{Emoji}/ug, '--');
  let len = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    if (isChinese(str[i])) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
}