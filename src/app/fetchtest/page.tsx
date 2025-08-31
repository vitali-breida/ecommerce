export const dynamic = 'force-dynamic';

export default async function FetchTest() {
  const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/hello');
  const data = await response.json();
  return <h1>{data.message}</h1>;
}
