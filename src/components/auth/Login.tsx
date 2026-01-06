import { useState } from "react";
import { signIn } from "../../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signIn(email, password);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div
        className="w-full max-w-sm rounded-2xl p-8 space-y-6
              bg-[#FEFAFB]
              border border-[#F2C2CF]
              shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      >
        <h1 className="text-xl font-semibold text-center text-[#F26B83]">
          Login
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
          onClick={handleLogin}
          className="w-full bg-[#F26B83] text-[#FEFAFB] py-3 rounded-lg hover:bg-[#F29BAB] transition"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          Not a membet yet?{" "}
          <Link
            to="/signup"
            className="text-[#F26B83] font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
