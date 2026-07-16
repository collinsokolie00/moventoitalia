import Link from "next/link";

import MobileNavigation from "./MobileNavigation";
import NavigationLinks from "./NavigationLinks";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-2xl font-extrabold tracking-tight text-blue-800"
        >
          Movento
        </Link>

        <NavigationLinks />

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/quote"
            className="rounded-full border border-blue-700 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get an Estimate
          </Link>

          <Link
            href="/booking"
            className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Book a Move
          </Link>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}