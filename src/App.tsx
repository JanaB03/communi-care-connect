
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import { LocationProvider } from "./contexts/LocationContext";

import Index from "./pages/Index";
import ClientDashboard from "./pages/ClientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthLayout from "./layouts/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <ChatProvider>
        <LocationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route element={<AuthLayout />}>
                  <Route path="/client" element={<ClientDashboard />} />
                  <Route path="/staff" element={<StaffDashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </ChatProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
