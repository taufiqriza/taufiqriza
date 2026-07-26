import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions, isAdminEmail } from "@/common/libs/auth";
import AdminShell from "@/modules/admin/components/AdminShell";

export default async function AdminPanelLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/admin/login`);
  }

  return <AdminShell>{children}</AdminShell>;
}
