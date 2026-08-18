import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/sidebar-nav";
import { AdminTopbar } from "@/components/admin/topbar";

export const metadata: Metadata = {
  title: "Admin | Infinia Visa",
  // An internal console: never indexed, never followed.
  robots: { index: false, follow: false },
};

/**
 * Admin shell: fixed rail on the left, sticky top strip, scrolling work area.
 *
 * The marketing header and footer are deliberately absent — this console shares the
 * brand tokens and nothing else.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <SidebarProvider
      // Narrower than the shadcn default so the work area gets the width it needs.
      style={{ "--sidebar-width": "16.75rem" } as React.CSSProperties}
    >
      <AdminSidebar />
      <SidebarInset className="min-w-0 bg-ground">
        <AdminTopbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
