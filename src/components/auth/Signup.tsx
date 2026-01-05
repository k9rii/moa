import { useState } from "react";
import { signUp } from "../../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signUp(email, password);
      alert(
        "Your registration has been completed.\nA verification email has been sent to your email address. Please check it and log in."
      );
      navigate("/login");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {" "}
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        <input
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          placeholder="moa@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up
        </button>
        <p className="text-sm text-center text-gray-500">
          Already a member?{" "}
          <Link to="/login" className="text-violet-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
