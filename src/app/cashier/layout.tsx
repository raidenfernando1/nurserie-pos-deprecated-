import ProtectedRoute from "@/components/protected-route";
import Listener from "../listener";
import LoadingBar from "@/components/loading-page";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CashierSidebar } from "@/components/sidebar/cashier-sidebar";

export default function CashierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute intendedRole="cashier">
      <LoadingBar duration={1500}>
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <CashierSidebar />
            <main className="flex flex-1 flex-col overflow-auto">
              <div className="flex-1 p-4">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </LoadingBar>
    </ProtectedRoute>
  );
}
