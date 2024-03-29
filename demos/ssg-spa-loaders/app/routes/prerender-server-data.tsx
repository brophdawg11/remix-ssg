import { useLoaderData } from "@remix-run/react";

export async function loader() {
  await new Promise((r) => setTimeout(r, 500));
  return {
    message: "This data came from the server loader that was run at build time",
    buildDate: new Date(),
  };
}

export default function Index() {
  const data = useLoaderData<unknown>() as Awaited<ReturnType<typeof loader>>;
  return (
    <div>
      <h1>Prerender Server Data</h1>
      <div>
        This page has a loader that was run at build time and saved into a
        <pre style={{ display: "inline" }}>.data</pre> file that can be fetched
        during SPA navigations.
      </div>
      <p>Loader data: {data.message}</p>
      <p>Build timestamp: {data.buildDate.toLocaleTimeString()}</p>
    </div>
  );
}
