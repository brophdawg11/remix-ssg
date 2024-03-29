# Remix SSG MPA

This is a Remix app with a simple script that will SSG the Remix app by spidering the site starting at the `/` path.

The routes in this app use server loaders so you can pre-render entire HTML documents complete with data (yay SEO!). In order to products a Multi-page app (no client-side navigation) we remove the `<Scripts>` element from `root.tsx`.

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
# node ../../spider --build ../demos/ssg-mpa/build/index.js --dir public
```

Then, you should hae a fully SSG'd site you can serve from `public/`:

```sh
npm run serve
# npx http-server public/
```

## Notes

- You can only use server loaders because the app doesn't hydrate
