# Remix SSR/SSG Hybrid

This is a Remix app using a hybrid approach of SSR and SSG. We create a normal Remix SSR app and then we crawl the `/pre-rendered` route and generate it's HTML at build time and store it in an "html" directory

Then, in our express server, for document requests we first look for a pre-rendered HTML page and return it if it exists. Otherwise, we fall through tgo the Remix handler. This allows document requests to `/pre-rendered` to serve the static file and avoid running any server loaders or doing any rendering. While other routes that do not have pre-rendered HTML will still SSR as usual.

In both cases, the application hydrates into a SPA for client-side navigations.

It should be noted that if you client-side route to a pre-rendered page, it will still call the server loader so you probably want to leverage a server-side cache for the data there (or strong Cache-Control headers and an edge CDN). Once the single-fetch proposal lands, you'll be able to pre-render the data for routes like this into .json files so that even on SPA navigations the server loader isn't called.

## Usage

First, install dependencies:

```sh
npm ci
```

Then, build your Remix app:

```sh
npm run build
```

And spider the `/pre-rendered` route, writing the statically generated HTML files to an `html/` directory:

```sh
npm run spider
# node ../../spider --build ../demos/ssr-ssg-hybrid/build/index.js --dir html --routes "/pre-rendered"
```

Then, you should hae a fully SSG'd site you can serve from `public/`:

```sh
npm run start
# cross-env NODE_ENV=production node ./server.js
```

## Notes

- Since this is a normal SSR'd REmix app there are no real restrictions!
- You can pick and choose which routes to pre-render
- You could check timestamps to determine when they're stale and skip them
- You could have a background process to re-crawl them on a schedule to keep them up to date
