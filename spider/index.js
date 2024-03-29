import util from "node:util";
import process from "node:process";
import path from "node:path";

import { createRequestHandler } from "@remix-run/server-runtime";
import fse from "fs-extra";
import { parse } from "node-html-parser";
import invariant from "tiny-invariant";

const { values: args } = util.parseArgs({
  options: {
    build: {
      type: "string",
      short: "b",
      required: true,
    },
    dir: {
      type: "string",
      short: "d",
      required: true,
    },
    routes: {
      type: "string",
      short: "r",
    },
    singleFetch: {
      type: "boolean",
      short: "s",
    },
  },
});
invariant(args.build, "Please specify a build path with --build");
invariant(args.dir, "Please specify an output directory with --dir");

let handler;
let queuedLinks = args.routes ? args.routes.split(",") : ["/"];
let crawledLinks = new Set();

run();

async function run() {
  const build = await import(args.build);
  handler = createRequestHandler(build, "production");
  processQueue();
}

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

  if (args.singleFetch) {
    let dataPath =
      pathname === "/" ? "/_root.data" : `${pathname.replace(/\/$/, "")}.data`;
    let dataRequest = new Request(`http://localhost${dataPath}`);
    console.log(`Rendering data path: ${dataPath}`);
    let dataResponse = await handler(dataRequest);
    let data = await dataResponse.text();
    let dataOutputPath = path.join(args.dir, dataPath);
    await fse.outputFile(dataOutputPath, data);
  }

  // Queue outgoing links
  let root = parse(html);
  for (let a of root.querySelectorAll("a")) {
    let href = a.getAttribute("href");
    if (!href.startsWith("/")) {
      continue;
    }
    if (
      !crawledLinks.has(href) &&
      !queuedLinks.includes(href) &&
      args.routes == null
    ) {
      queuedLinks.push(href);
    }
  }
}
