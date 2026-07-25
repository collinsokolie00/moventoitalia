import { redirect } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminSession } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader user={user} />
      {children}
    </div>
  );
}
