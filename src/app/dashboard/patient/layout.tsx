    import SideNavigation from "./components/sidenavigation";
    import TopNavigation from "./components/topnavigation";

    interface DashboardLayoutProps {
      children: React.ReactNode;
    }

    const DashboardLayout = ({ children }: DashboardLayoutProps) => {
      return (
        <div className="flex min-h-screen bg-[#007E85]">
          <SideNavigation />
          <div className="flex-1 ml-32">
            <div className="min-h-screen bg-gray-50 rounded-l-[40px] p-8">
              <TopNavigation patientName="Kim" />
              <main className="mt-8">{children}</main>
            </div>
          </div>
        </div>
      );
    };

    export default DashboardLayout;
