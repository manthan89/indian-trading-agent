import "@/app/globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen bg-background">
        {children}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
