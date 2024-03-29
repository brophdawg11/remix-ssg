import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";

export async function loader() {
  await new Promise((r) => setTimeout(r, 500));
  return json({ message: "This data came from the server loader" });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Prerendered Page</h1>
      <p>
        This page has a loader but we pre-rendered its HTML and we serve that
        from our Express handler when its available and avoid the need to call
        the server loader and dynamically render the page. However, it can still
        hydrate into a SPA like any other SSR'd page.
      </p>
      <p>
        If you client-side route to this page, it will still call the server
        loader so you probably want to leverage a server-side cache for the data
        there (or strong Cache-Control headers and an edge CDN). Once the single
        fetch proposal lands, you'll be able to pre-render the data for routes
        like this into .json files so that even on SPA navigations the server
        loader isn't called.
      </p>

      <p>Loader data: {data.message}</p>
    </div>
  );
}
