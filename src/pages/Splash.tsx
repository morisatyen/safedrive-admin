import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero animate-fade-in">
      <div className="text-center animate-fade-in-scale">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white/10 p-8 backdrop-blur-sm">
            <Shield className="h-24 w-24 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-3">SafeDrive</h1>
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
