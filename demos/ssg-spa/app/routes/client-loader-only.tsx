import { useLoaderData } from "@remix-run/react";

export async function clientLoader() {
  await new Promise((r) => setTimeout(r, 500));
  return { message: "This data came from the client loader" };
}

export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  return (
    <div>
      <h1>clientLoader Only</h1>
      <p>
        This page only has a clientLoader. It provides a HydrateFallback that we
        can SSG and then calls the clientLoader on initial document load SPA
        navigations to this route
      </p>
      <p>Loader data: {data.message}</p>
    </div>
  );
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}
