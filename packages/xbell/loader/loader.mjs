
import process from 'node:process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from "node:url";
import { compiler } from "../dist/compiler/compiler.mjs";

process.setSourceMapsEnabled(true);

export async function load(url, context, nextLoad) {
  if (/\.(tsx|ts)$/.test(url)) {
    const filePath = fileURLToPath(url);
    const { code } = await compiler.compileNodeJSCode(
      readFileSync(filePath, "utf-8"),
      filePath
    );

    return {
      shortCircuit: true,
      format: 'module',
      source: code,
    };
  }
  return nextLoad(url, context);
}
