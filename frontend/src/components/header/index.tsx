export function Header() {
  return (
    <header className="flex flex-col items-start p-4 bg-gray-100 h-screen w-32 shrink-0">
      <h1 className="text-2xl font-bold flex flex-col ">Header</h1>
      <nav>
        <ul className="flex flex-col space-y-2">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/reports" className="hover:underline">
              Reports
            </a>
          </li>
          <li>
            <a href="/sensors" className="hover:underline">
              Sensors
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
