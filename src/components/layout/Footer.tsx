import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-2xl font-extrabold text-white">Movento</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Premium moving, furniture transport and relocation services across
            Terni, Perugia, Rome and nearby areas.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Services</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/services">Home moves</Link>
            <Link href="/services">Office moves</Link>
            <Link href="/services">Furniture transport</Link>
            <Link href="/services">Packing and assembly</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Company</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
            <Link href="/about">About Movento</Link>
            <Link href="/service-areas">Service areas</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Start your move</h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Request an estimate or reserve your preferred moving date.
          </p>

          <Link
            href="/quote"
            className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Request an Estimate
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Movento. All rights reserved.</p>
          <p>Moving what matters with care.</p>
        </div>
      </div>
    </footer>
  );
}
