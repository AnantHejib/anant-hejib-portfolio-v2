import { rmSync } from "node:fs";
import { resolve, relative } from "node:path";

const workspace = resolve(process.cwd());
const target = resolve(workspace, ".next");
const rel = relative(workspace, target);

if (rel === ".next" && !rel.startsWith("..")) {
  rmSync(target, { recursive: true, force: true });
  console.log("Cleared generated Next.js cache.");
}
