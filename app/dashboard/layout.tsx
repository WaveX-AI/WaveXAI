interface DashboardLayoutProps {
    children: React.ReactNode;
  }
  
  export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }