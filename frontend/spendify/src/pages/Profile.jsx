import { ThemeProvider } from "../components/Profile/theme-provider";
import Sidebar from "./Sidebar";
import ProfileDashboard from "./ProfileDashboard";

function Profile() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="finance-theme">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-background">
          <ProfileDashboard />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Profile;
