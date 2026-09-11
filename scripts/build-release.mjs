import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Wrangler runs this before reading dist, including on a direct CLI deploy.
// Keep local drafts and untracked public documents out of production builds.
const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const changed = git('diff', '--name-only', 'HEAD');
const untracked = git('ls-files', '--others', '--',
  'src', 'public', 'scripts', 'astro.config.mjs', 'package.json',
  'package-lock.json', 'wrangler.jsonc', 'tsconfig.json');

if (changed || untracked) {
  console.error('Release stopped: build from a clean checkout of the reviewed commit.');
  if (changed) console.error(`Uncommitted tracked files:\n${changed}`);
  if (untracked) console.error(`Untracked build inputs:\n${untracked}`);
  process.exit(1);
}

console.log(`Building committed release ${git('rev-parse', 'HEAD')}`);
const build = spawnSync(process.execPath, ['node_modules/astro/astro.js', 'build'], {
  cwd: root,
  stdio: 'inherit',
});
if (build.error) throw build.error;
process.exit(build.status ?? 1);
