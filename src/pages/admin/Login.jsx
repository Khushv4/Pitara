import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
      <form
        onSubmit={handleSubmit}
        className="
        bg-white
        p-8
        rounded-3xl
        shadow-sm
        w-full
        max-w-md
      "
      >
        <h1
          className="
          text-3xl
          font-bold
          text-[#1A531A]
          mb-6
        "
        >
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
        />

        <button
          disabled={loading}
          className="
          w-full
          bg-[#1A531A]
          text-white
          py-3
          rounded-xl
          hover:opacity-90
        "
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;