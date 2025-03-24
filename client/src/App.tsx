import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { RealTimeProvider } from "@/context/RealTimeContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import EnergyManagement from "@/pages/EnergyManagement";
import WaterSupply from "@/pages/WaterSupply";
import SmartAgriculture from "@/pages/SmartAgriculture";
import Alerts from "@/pages/Alerts";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import { SidebarProvider } from '@/context/SidebarContext';
import { BrowserRouter } from 'react-router-dom';
import AdminProfile from "@/pages/AdminProfile";
import AdminSettings from "@/pages/AdminSettings";  // Add this line
import AdminSecurity from "@/pages/AdminSecurity";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/energy" component={EnergyManagement} />
      <Route path="/water" component={WaterSupply} />
      <Route path="/agriculture" component={SmartAgriculture} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin/profile" component={AdminProfile} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/security" component={AdminSecurity} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <RealTimeProvider>
            <Router />
            <Toaster />
          </RealTimeProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
