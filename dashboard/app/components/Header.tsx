import Link from "next/link";


const navLinks = [
  { label: "API Docs", href: "https://docs.uuidify.io" },
  { label: "Status", href: "https://status.uuidify.io" },
  { label: "GitHub", href: "https://github.com/uuidify/uuidify" },
];

export default function Header() {
  return (
    <header className="border-b border-white/5 bg-black/30 shadow-xl shadow-black/40 backdrop-blur">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-6">
        <Link href="/" className="flex items-center gap-2 text-white/90">
          <span className="text-lg font-semibold tracking-tight">
            UUIDify Analytics
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1 text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
