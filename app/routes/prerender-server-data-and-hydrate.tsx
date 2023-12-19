import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";

export async function loader() {
  await new Promise((r) => setTimeout(r, 500));
  return json({ message: "This data came from the server loader" });
}

export async function clientLoader() {
  await new Promise((r) => setTimeout(r, 500));
  return { message: "This data came from the client loader" };
}
clientLoader.hydrate = true;

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  return (
    <div>
      <h1>Prerender Server Data</h1>
      <p>
        This page has both a loader and a clientLoader. The server loader is
        used to SSG/pre-render the page, and then clientLoader is both run on
        hydration and called on any SPA navigations to this route
      </p>
      <p>Loader data: {data.message}</p>
    </div>
  );
}
