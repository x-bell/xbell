export function getEnv() {
  const reg = /xbell\/test-site\/(.+)\//;
  const m = window.location.href.match(reg)
  if (m) {
    return m[1]
  }

  return null;
}