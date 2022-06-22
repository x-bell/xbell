export default function getEnv(href: string) {
  const env = href.split('test-site\/').pop().split('\/')[0]
  return env;
}