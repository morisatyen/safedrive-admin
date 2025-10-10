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
        <div className="mb-6 flex justify-center">
          <img 
            src="/Logo.png" 
            alt="SafeDrive Logo" 
            className="h-24 w-24 object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold mb-3">
          <span style={{ color: '#E53935' }}>SAFE</span>
          <span style={{ color: '#000000' }}>DRIVE</span>
        </h1>
        <p className="text-xl text-white/80 font-medium">Administrator Portal</p>
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
