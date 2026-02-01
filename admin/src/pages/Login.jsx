import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const STATIC_USERS = [
  {
    id: 1,
    name: "Demo User",
    loginId: "user01",
    password: "123456",
    role: "user",
  },
  {
    id: 2,
    name: "Finance Admin",
    loginId: "finance01",
    password: "123456",
    role: "admin",
  },
];

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ======================
     AUTO LOGIN CHECK
  ====================== */
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/");
    }
  }, [navigate]);

  /* ======================
     LOGIN HANDLER
  ====================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedUsers =
        JSON.parse(localStorage.getItem("users")) || STATIC_USERS;

      const user = storedUsers.find(
        (u) => u.loginId === loginId && u.password === password
      );

      if (!user) {
        setError("Invalid Login ID or Password");
        toast.error("Invalid Login ID or Password");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      console.warn("Login error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            Shiv Furniture
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Budget Accounting System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            className="input-field"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />

          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs">
          <p className="font-semibold">Demo Accounts</p>
          <p>user01 / 123456</p>
          <p>finance01 / 123456</p>

          <p className="mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
