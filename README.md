# Remix SSG

You are probably better off running your app with a live Remix server. But people ask for SSG all the time so this is an exercise in how you could do that today in Remix. It's slightly more capable now that Remix supports [Client Data](https://remix.run/docs/en/main/guides/client-data).

This is a Remix app with a simple script that will SSG the Remix app by spidering the site starting at the `/` path.

This is basically a node version of the approach [outlined by @mjackson on Twitter](https://twitter.com/mjackson/status/1585795441907494912).

## Usage

First, clone this repo and install dependencies for the Remix app and for the SSG spidering script:

```sh
git clone git@github.com:brophdawg11/remix-ssg.git
cd remix-ssg
npm ci
cd ssg
npm ci
cd ..
```

Then, build your Remix app:

```sh
npm run build
```

And spider the app, writing the statically generated HTML files to the `public/` directory alongside your build assets:

```sh
node ssg/index.js --dir public
```

Then, you should hae a fully SSG'd site you can serve from `public/`:

```sh
npx http-server --port 3000 public/
```

## Notes

- For the most part, you want to stick with `clientLoader`/`clientAction` for your data
  - You _can_ use a server `loader` to generate the static HTML if you'd like, but it will not be available at runtime and you should never call `serverLoader`/`serverAction` because there is no endpoint to hit
  - See `routes/prerender-server-data.tsx` and `routes/prerender-server-data-and-hydrate.tsx` for examples
- You can use `HydrateFallback` components to partially pre-render the page down to a certain point in the route hierarchy
  - See `routes/client-loader-only.tsx` for an example
