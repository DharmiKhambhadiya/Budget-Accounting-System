import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { userLoginApi } from "../utils/API/authapi";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await userLoginApi({ loginId, password });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed");
      }

      const { token, ...user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";

      setError(message);
      toast.error(message);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login ID
            </label>
            <input
              type="text"
              className="input-field"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your login ID"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-600 mb-4">
            <strong className="text-gray-900">Demo Accounts:</strong>
          </p>
          <ul className="text-xs text-gray-600 space-y-1 font-mono mb-6">
            <li>user01 / 123456</li>
            <li>finance01 / 123456</li>
          </ul>
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
