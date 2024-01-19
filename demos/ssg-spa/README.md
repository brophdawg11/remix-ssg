# Remix SSG SPA

This is a Remix app with a simple script that will SSG the Remix app by spidering the site starting at the `/` path.

The routes in this app use server loaders so you can pre-render entire HTML documents complete with data (yay SEO!). But it also allows the site to then hydrate ito a SPA because the routes are using `clientLoader`'s that don't call `serverLoader` so it can be deployed statically without ever trying to hit the Remix server on client-side navigations.

## Usage

First, install dependencies:

```sh
npm ci
```

Then, build your Remix app:

```sh
npm run build
```

And spider the built app, writing the statically generated HTML files to the `public/` directory alongside your build assets:

```sh
npm run spider
# node ../../spider --build ../demos/ssg-spa/build/index.js --dir public
```

Then, you should hae a fully SSG'd site you can serve from `public/`:

```sh
npm run serve
# npx http-server public/
```

## Notes

- For the most part, you want to stick with `clientLoader`/`clientAction` for your data
  - You _can_ use a server `loader` to generate the static HTML if you'd like, but it will not be available at runtime and you should never call `serverLoader`/`serverAction` because there is no endpoint to hit
  - See `routes/prerender-server-data.tsx` and `routes/prerender-server-data-and-hydrate.tsx` for examples
- You can use `HydrateFallback` components to partially pre-render the page down to a certain point in the route hierarchy
  - See `routes/client-loader-only.tsx` for an example
