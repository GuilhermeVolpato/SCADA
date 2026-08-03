export function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">Header</h1>
      <nav>
        <ul className="flex space-x-4">
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
