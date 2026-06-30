import { useState } from "react";
import { resetPassword } from "../../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
  e.preventDefault();

  try {
    await resetPassword(email);
    alert("Password reset email has been sent.");
  } catch (error) {
  console.error(error);
  alert(error.message);
}
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Forgot Password
        </h1>

        <p className="mb-6 text-slate-500">
          Enter your email to receive a password reset link.
        </p>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button className="mt-6 w-full">
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}

export default ForgotPassword;