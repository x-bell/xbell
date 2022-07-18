import { container } from "../core/container";
import { transformNodeCode } from "../compiler/node-transform";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function load(url: string, context: any, nextLoad: any) {
  if (/\.(tsx|ts)$/.test(url)) {
    const code = await transformNodeCode(
      readFileSync(fileURLToPath(url), "utf-8")
    );

    return {
      shortCircuit: true,
      format: 'module',
      source: code,
    };
  }

  return nextLoad(url, context);
}
