import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice.js";
import { toast } from "sonner";
import { jwtDecode } from 'jwt-decode';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const decode = jwtDecode(token);
      const user = { id: decode.id, role: decode.role };

      dispatch(setCredentials({ token, user }));

      setTimeout(() => {
        if (user.role === "admin") {
          toast.success("Admin access granted");
          navigate("/admin/dashboard");
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      }, 1500);
    } else {
      toast.error("Authentication failed");
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
          {/* Animated Success Icon */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute inset-0 scale-150 bg-green-50 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Authentication Successful
          </h2>
          <p className="text-slate-500 mb-8">
            Securing your session and redirecting you...
          </p>

          {/* Subtle Spinner */}
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
            <span className="text-sm font-medium tracking-wide uppercase">Finalizing</span>
          </div>
        </div>
        
        {/* Footer Brand (Optional) */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          Redirecting to your personalized dashboard
        </p>
      </div>
    </div>
  );
}