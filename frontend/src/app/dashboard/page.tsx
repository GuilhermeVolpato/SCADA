import { Button } from "@/components/button";

// server component
export default async function Dashboard() {
  const response = await fetch("http://dummyjson.com/posts");
  const data = await response.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600">
        This is the dashboard page of the application.
      </p>
      <Button />

      <div className="mt-4 text-lg text-gray-600">
        <h2 className="text-2xl font-semibold mb-2">Posts:</h2>
        <ul className="list-disc pl-5">
          {data.map((post: any) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
