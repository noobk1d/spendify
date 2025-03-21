import { ThemeProvider } from "../components/Profile/theme-provider";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";

function Dashboard() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="finance-theme">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-background">
          <DashboardContent></DashboardContent>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Dashboard;
