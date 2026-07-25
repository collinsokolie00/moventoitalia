import Link from "next/link";
import Image from "next/image";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import type { AdminUser } from "@/lib/auth/session";

export default function AdminHeader({ user }: { user: AdminUser }) {
  return (
    <header
      className="sticky top-0 z-50 isolate w-full text-white shadow-md shadow-blue-950/15"
      style={{
        backgroundColor: "#193cb8",
        color: "#ffffff",
        opacity: 1,
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 lg:px-8">
        <Link href="/admin" className="group flex min-w-0 items-center gap-3" aria-label="Movento Admin dashboard">
          <Image src="/movento-logo.png" alt="Movento" width={1716} height={889} priority className="h-11 w-auto shrink-0 brightness-0 invert sm:h-12" />
          <span className="hidden text-xs font-semibold text-blue-100 min-[390px]:block">Admin</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-bold text-white">{user.displayName}</p>
            <p className="truncate text-xs text-blue-100">{user.email}</p>
          </div>
          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}
