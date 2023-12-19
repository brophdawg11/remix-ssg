import { parseArgs } from "node:util";
import path from "node:path";

import { createRequestHandler } from "@remix-run/server-runtime";
import fse from "fs-extra";
import { parse } from "node-html-parser";
import invariant from "tiny-invariant";

import * as build from "../build/index.js";

const { values: args } = parseArgs({
  options: {
    dir: {
      type: "string",
      short: "d",
      required: true,
    },
  },
});
invariant(args.dir, "Please specify an output directory with --dir");

let handler = createRequestHandler(build, "production");

let queuedLinks = ["/"];
let crawledLinks = new Set();

processQueue();

async function processQueue() {
  while (queuedLinks.length > 0) {
    let href = queuedLinks.shift();
    await crawlLink(href);
  }
}

async function crawlLink(pathname) {
  invariant(pathname.startsWith("/"), "Paths must start with /");

  if (crawledLinks.has(pathname)) {
    return;
  }
  crawledLinks.add(pathname);

  // Crawl with a trailing slash to avoid hydration issues
  if (!pathname.endsWith("/")) {
    pathname = pathname + "/";
  }
  let request = new Request(`http://localhost${pathname}`);
  console.log(
    `Rendering path: ${pathname} (${queuedLinks.length} known link(s) remaining)`
  );
  let response = await handler(request);
  let html = await response.text();
  let outputPath = path.join(args.dir, pathname, "index.html");
  await fse.outputFile(outputPath, html);

  // Queue outgoing links
  let root = parse(html);
  for (let a of root.querySelectorAll("a")) {
    let href = a.getAttribute("href");
    if (!href.startsWith("/")) {
      continue;
    }
    if (!crawledLinks.has(href) && !queuedLinks.includes(href)) {
      queuedLinks.push(href);
    }
  }
}
