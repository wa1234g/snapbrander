import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          SnapBrander
        </Link>
        <div className="flex space-x-4">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-800">
            Pricing
          </Link>
          <Link href="/templates" className="text-gray-600 hover:text-gray-800">
            Templates
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
