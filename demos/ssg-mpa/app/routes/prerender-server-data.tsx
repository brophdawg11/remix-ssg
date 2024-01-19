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
      <h1>Prerender Server Data</h1>
      <p>This page has a loader which is used to SSG/pre-render the page</p>
      <p>Loader data: {data.message}</p>
    </div>
  );
}
