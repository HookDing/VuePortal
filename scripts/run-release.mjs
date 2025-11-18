#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { mkdir, rm, stat, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);

const args = process.argv.slice(2);
let mode = 'production';
let skipInstall = false;

for (let i = 0; i < args.length; i += 1) {
  const token = args[i];
  if (token === '--mode' && args[i + 1]) {
    mode = args[i + 1];
    i += 1;
  } else if (token === '--skip-install') {
    skipInstall = true;
  } else if (!token.startsWith('--')) {
    mode = token;
  }
}

const runCommand = (command, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: mode },
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Command "${command}" failed in ${cwd} (code ${code})`));
      }
    });
  });

const copyRecursive = async (source, destination) => {
  const srcStat = await stat(source);
  if (srcStat.isDirectory()) {
    await mkdir(destination, { recursive: true });
    const entries = await readdir(source);
    await Promise.all(entries.map((entry) => copyRecursive(path.join(source, entry), path.join(destination, entry))));
  } else {
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
};

const configPath = path.join(projectRoot, 'release.config.json');
const config = JSON.parse(await readFile(configPath, 'utf-8'));
const packages = config.packages ?? [];
const artifactsDir = path.join(projectRoot, config.artifactsDir ?? 'release');

await rm(artifactsDir, { recursive: true, force: true });
await mkdir(artifactsDir, { recursive: true });

for (const pkg of packages) {
  const pkgRoot = path.join(projectRoot, pkg.path);
  const pkgTarget = path.join(artifactsDir, pkg.name);
  console.log(`\n[build] ${pkg.name} (${pkgRoot})`);

  if (!skipInstall) {
    await runCommand('npm install', pkgRoot);
  }

  const buildCommand = (pkg.buildScript ?? 'npm run build').replace(/\$\{(mode|configuration)\}/gi, mode);
  await runCommand(buildCommand, pkgRoot);

  const outputSource = path.join(pkgRoot, pkg.output);
  await copyRecursive(outputSource, path.join(pkgTarget, pkg.output));

  if (Array.isArray(pkg.include)) {
    for (const extra of pkg.include) {
      const src = path.join(pkgRoot, extra);
      const dest = path.join(pkgTarget, extra);
      await copyRecursive(src, dest);
    }
  }

  console.log(`[done] ${pkg.name} artifacts copied to ${pkgTarget}`);
}

console.log(`\nRelease artifacts available in ${artifactsDir}`);
