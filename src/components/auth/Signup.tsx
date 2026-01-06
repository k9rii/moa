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
      <div
        className="w-full max-w-sm rounded-2xl p-8 space-y-6
              bg-[#FEFAFB]
              border border-[#F2C2CF]
              shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      >
        {" "}
        <h1 className="text-xl font-semibold text-center text-[#F26B83]">
          Sign Up
        </h1>
        <input
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F29BAB]"
          placeholder="moa@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F29BAB]"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-[#F26B83] text-[#FEFAFB] py-3 rounded-lg hover:bg-[#F29BAB] transition"
        >
          Sign Up
        </button>
        <p className="text-sm text-center text-gray-500">
          Already a member?{" "}
          <Link to="/login" className="text-[#F26B83] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
