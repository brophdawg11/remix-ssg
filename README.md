# Remix SSG SPA

You are probably better off running your app with a live Remix server. But people ask for SSG all the time so this is an exercise in how you could do that today in Remix. It's slightly more capable now that Remix supports [Client Data](https://remix.run/docs/en/main/guides/client-data).

These examples are basically node versions of the approach [outlined by @mjackson on Twitter](https://twitter.com/mjackson/status/1585795441907494912).

## Usage

First, clone this repo and install dependencies for the Remix demo apps and for the SSG spidering script:

```sh
git clone git@github.com:brophdawg11/remix-ssg.git
cd remix-ssg
npm ci
cd spider
npm ci
cd ..
```

Then, each app in `demos/` is a standalone Remix app that you can run and investigate to see the different patterns you can achieve with Remix and Client Data.

- [`demos/ssg-mpa`](./demos/ssg-mpa) - This is an SSG'd application that only uses server loaders so we can SSG entire HTML documents into a multi-page app that can be statically deployed
- [`demos/ssg-spa-client-loaders`](./demos/ssg-spa-client-loaders) - This is an SSG'd application that uses server loaders so we can SSG entire HTML documents, but also hydrates into a SPA via the usage of `clientLoader`s that do not call the server loaders so it can be statically deployed.
- [`demos/ssr-ssg-hybrid`](./demos/ssr-ssg-hybrid) - This is hybrid SSR/SSG application that where some routes are pre-rendered to HTML and then served statically from the express server on document requests. Other routes are served using normal SSR.
