export const metadata = {
  title: "Home Page",
  description: "This is the home page of the application.",
  openGraph: {
    title: "Home Page",
    description: "This is the home page of the application.",
    siteName: "Mini SCADA Industrial",
    images: [
      {
        url: "https://www.example.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg text-gray-600">
        This is the main landing page of the application.
      </p>
    </main>
  );
}
