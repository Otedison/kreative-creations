import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const distDir = "dist";
const appDir = join(".next", "server", "app");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

cpSync("public", distDir, { recursive: true });
cpSync(join(".next", "static"), join(distDir, "_next", "static"), { recursive: true });

const copyHtmlRoutes = (directory) => {
  for (const entry of readdirSync(directory)) {
    const source = join(directory, entry);
    const relativePath = relative(appDir, source);

    if (statSync(source).isDirectory()) {
      copyHtmlRoutes(source);
      continue;
    }

    if (!entry.endsWith(".html")) continue;

    const routePath =
      relativePath === "index.html"
        ? join(distDir, "index.html")
        : join(distDir, relativePath.replace(/\.html$/, ""), "index.html");

    mkdirSync(join(routePath, ".."), { recursive: true });
    cpSync(source, routePath);
  }
};

copyHtmlRoutes(appDir);

for (const route of ["robots.txt", "sitemap.xml"]) {
  const body = join(appDir, `${route}.body`);
  if (statSync(body, { throwIfNoEntry: false })) {
    cpSync(body, join(distDir, route));
  }
}
