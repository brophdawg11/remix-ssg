# Remix SSG SPA

This is a Remix app with a simple script that will SSG the Remix app by spidering the site starting at the `/` path.

The routes in this app use server loaders so you can pre-render entire HTML documents complete with data (yay SEO!). **But!** Since we're using Remix Single Fetch we can _also_ prerender all of the data from each server loader into `.data` files. This allows the site to then hydrate ito a SPA because the routes can call their "server loaders" and just receive back the pre-rendered `.data` files from a CDN. This way, it can be deployed statically without ever trying to hit the Remix server on client-side navigations.

## Usage

First, install dependencies:

```sh
npm ci
```

Then, build your Remix app:

```sh
npm run build
```

And spider the built app, writing the statically generated HTML files to the `build/client` directory alongside your build assets:

```sh
npm run spider
# node ../../spider --build ../demos/ssg-spa-loaders/build/index.js --dir build/client --singleFetch
```

Then, you should hae a fully SSG'd site you can serve from `build/client/`:

```sh
npm run serve
# npx http-server build/client/
```

## Notes

Your SSG'd data files are essentially a cache that you have full control over. If you want to update the data, just push a new `.data` file.
