import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { isAdminAuthenticated } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-blue-950 via-blue-900 to-slate-950 px-5 py-12">
      <section className="w-full max-w-md rounded-4xl bg-white p-8 shadow-2xl sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">Movento</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">Admin access</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Sign in with your approved Google account to manage the Movento website.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
