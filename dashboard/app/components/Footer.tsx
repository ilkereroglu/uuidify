export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 py-8 text-sm text-slate-400">
      <div className="container flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} UUIDify. All rights reserved.</p>
        <p className="text-xs">
          Built for Cloudflare Pages · Powered by serverless analytics.
        </p>
      </div>
    </footer>
  );
}
