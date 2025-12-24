#!/usr/bin/env node
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const options = {
    root: ".",
    out: "mkdoc.tree.json",
    onlyMd: false,
    exclude: []
};

function printHelp() {
    console.log(`mkdoc-generate-tree
Usage:
  node scripts/mkdoc-generate-tree.mjs [--root <dir>] [--out <file>] [--only-md] [--exclude <path>]

Options:
  --root <dir>     Root directory to scan (default: ".")
  --out <file>     Output file path (default: "mkdoc.tree.json")
  --only-md        Only include .md/.markdown files
  --exclude <path> Exclude a path or directory name (can be used multiple times)
  -h, --help       Show this help message
`);
}

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-h" || arg === "--help") {
        printHelp();
        process.exit(0);
    }
    if (arg === "--root") {
        options.root = args[i + 1] || options.root;
        i++;
        continue;
    }
    if (arg === "--out") {
        options.out = args[i + 1] || options.out;
        i++;
        continue;
    }
    if (arg === "--only-md") {
        options.onlyMd = true;
        continue;
    }
    if (arg === "--exclude") {
        const value = args[i + 1];
        if (value) {
            options.exclude.push(value);
            i++;
        }
        continue;
    }
}

const defaultExcludes = [
    ".git",
    "node_modules",
    ".DS_Store",
    "dist",
    "build",
    "out",
    ".idea",
    ".vscode"
];

const repoRoot = process.cwd();
const rootAbs = path.resolve(options.root);
const outAbs = path.resolve(options.out);

if (!fs.existsSync(rootAbs)) {
    console.error(`[mkdoc] Root directory not found: ${rootAbs}`);
    process.exit(1);
}

function toPosix(p) {
    return p.replace(/\\/g, "/");
}

const excludeList = [...defaultExcludes, ...options.exclude].map(p => toPosix(p));
const outRel = toPosix(path.relative(repoRoot, outAbs));
const items = [];
const seen = new Set();

function shouldExclude(name, relPath) {
    for (const raw of excludeList) {
        if (!raw) continue;
        const normalized = raw.replace(/\/+$/, "");
        if (normalized === name) return true;
        if (relPath === normalized) return true;
        if (relPath.startsWith(normalized + "/")) return true;
    }
    return false;
}

function addItem(item) {
    if (!item || !item.path) return;
    const key = `${item.type}:${item.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push(item);
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relFromRepo = toPosix(path.relative(repoRoot, fullPath));

        if (!relFromRepo || relFromRepo === ".") continue;
        if (relFromRepo === outRel) continue;
        if (shouldExclude(entry.name, relFromRepo)) continue;

        if (entry.isDirectory()) {
            addItem({ path: relFromRepo, type: "tree" });
            walk(fullPath);
            continue;
        }

        if (entry.isFile()) {
            if (options.onlyMd) {
                const lower = entry.name.toLowerCase();
                if (!(lower.endsWith(".md") || lower.endsWith(".markdown"))) continue;
            }
            addItem({ path: relFromRepo, type: "blob" });
        }
    }
}

walk(rootAbs);

items.sort((a, b) => a.path.localeCompare(b.path));

const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    root: options.root,
    items
};

fs.mkdirSync(path.dirname(outAbs), { recursive: true });
fs.writeFileSync(outAbs, JSON.stringify(payload, null, 2), "utf8");

console.log(`[mkdoc] Wrote ${items.length} items to ${outAbs}`);
