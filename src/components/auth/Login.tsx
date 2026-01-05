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
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="moa@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded-lg"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500">
          Not a membet yet?{" "}
          <Link to="/signup" className="text-violet-500 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
