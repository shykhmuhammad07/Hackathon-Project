// Login.jsx - Updated with modern purple/pink theme
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../Component/LoginForm";
import {auth} from "../Config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function Login() {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let getData = (value) => {
    setLoading(true);
    setError("");
    
    signInWithEmailAndPassword(auth, value.email, value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/dash");
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid email or password. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/20 p-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <span className="text-3xl text-white">🚀</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            PitchCraft
          </h1>
          <p className="text-gray-300 text-lg">Welcome back to your AI pitch generator</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <LoginForm data={getData} loading={loading} />

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Additional Options */}
        <div className="text-center space-y-4">
          <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-gray-400 text-sm">
            Forgot your password?{" "}
            <button className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
              Reset it here
            </button>
          </p>
        </div>

        {/* Signup Link */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-center text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          By continuing, you agree to our{" "}
          <button className="text-purple-300 hover:text-purple-200 transition-colors">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-purple-300 hover:text-purple-200 transition-colors">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;