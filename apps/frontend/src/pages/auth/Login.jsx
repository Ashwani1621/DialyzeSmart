import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeartPulse, ShieldCheck, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../firebase/firebase";
import { loginUser } from "../../services/authService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const userCredential = await loginUser(email, password);

      const uid = userCredential.user.uid;

      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        alert("User record not found.");
        return;
      }

      const role = snap.data().role;

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "patient") navigate("/patient/dashboard");
      else alert("Invalid role.");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">

      {/* Left Section */}

      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-16 text-white"
      >
        <h1 className="text-5xl font-extrabold">
          DialyzeSmart
        </h1>

        <p className="mt-4 text-lg text-blue-100">
          AI Powered Dialysis Monitoring Platform
        </p>

        <div className="mt-16 space-y-8">

          <div className="flex items-center gap-4">
            <HeartPulse className="h-10 w-10" />
            <div>
              <h3 className="text-xl font-semibold">
                Smart Monitoring
              </h3>
              <p className="text-blue-100">
                Track dialysis sessions with ease.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ShieldCheck className="h-10 w-10" />
            <div>
              <h3 className="text-xl font-semibold">
                Secure Medical Records
              </h3>
              <p className="text-blue-100">
                Firebase powered authentication & storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Activity className="h-10 w-10" />
            <div>
              <h3 className="text-xl font-semibold">
                AI Risk Assessment
              </h3>
              <p className="text-blue-100">
                Flag per-session nutritional risk intelligently.
              </p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Right Section */}

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-md rounded-3xl border-0 bg-white p-10 shadow-2xl">

          <h2 className="text-3xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-slate-500">
            Sign in to continue to DialyzeSmart
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl text-base"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 border-t pt-6 text-center text-sm text-slate-500">
            Authorized personnel only.
          </div>

        </Card>
      </motion.div>

    </div>
  );
}

export default Login;