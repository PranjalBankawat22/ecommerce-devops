import Link from "next/link";

const footerLinks = [
  { label: "Electronics", href: "/?category=Electronics" },
  { label: "Fashion", href: "/?category=Fashion" },
  { label: "Accessories", href: "/?category=Accessories" },
];

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-indigo-600 tracking-tight"
            >
              Shoply
            </Link>
            <p className="mt-1 text-sm text-gray-500">
              Everything you need. One simple store.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Shoply. Built for demonstration
          purposes.
        </p>
      </div>
    </footer>
  );
}
