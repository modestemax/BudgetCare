import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-mist">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}