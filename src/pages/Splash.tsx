import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero animate-fade-in">
      <div className="text-center animate-fade-in-scale">
        <div className="mb-2 flex justify-center">
          <img
            src="/Logo.png"
            alt="SafeDrive Logo"
            className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36 object-contain"
          />
        </div>
        <h1 className="font-bold mb-3 flex justify-center items-center gap-3 animate-gradient-text bg-gradient-to-r from-red-500 via-black to-black bg-clip-text text-transparent 
               text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          <span style={{ color: '#E53935' }}>SAFE</span>
          <span style={{ color: '#f4ebebff' }}>DRIVE</span>
        </h1>
        <p className="text-center font-medium text-white/80 
              text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Administrator Portal</p>
        <div className="mt-8">
          <div className="flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse-glow"></div>
            <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse-glow animation-delay-200"></div>
            <div className="h-2 w-2 rounded-full bg-white/60 animate-pulse-glow animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
