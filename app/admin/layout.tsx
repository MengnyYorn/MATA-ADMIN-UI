import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </div>
  );
}
