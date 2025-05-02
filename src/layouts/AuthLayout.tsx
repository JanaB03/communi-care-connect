
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import MainNavbar from "@/components/navigation/MainNavbar";
import MobileNavbar from "@/components/navigation/MobileNavbar";
import { useIsMobile } from "@/hooks/use-mobile";

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-navy text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <Outlet />
      </main>
      {isMobile && <MobileNavbar />}
    </div>
  );
};

export default AuthLayout;
