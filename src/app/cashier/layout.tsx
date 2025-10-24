import ProtectedRoute from "@/components/protected-route";
import LoadingBar from "@/components/loading-page";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CashierSidebar } from "@/components/sidebar/cashier-sidebar";
import PopupHandler from "@/components/popup/popup-handler";

export default function CashierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute intendedRole="cashier">
      <LoadingBar duration={1500}>
        <PopupHandler>
          <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">
              <CashierSidebar />
              <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 p-4 overflow-hidden">{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </PopupHandler>
      </LoadingBar>
    </ProtectedRoute>
  );
}
