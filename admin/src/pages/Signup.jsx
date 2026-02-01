import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ======================
     REDIRECT IF LOGGED IN
  ====================== */
  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      navigate("/admin/dashboard");
    }
  }, []);

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.loginId.trim()) newErrors.loginId = "Login ID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================
     INPUT CHANGE
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Fix validation errors");
      return;
    }

    setLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const exists = users.some((u) => u.loginId === formData.loginId);

      if (exists) {
        toast.error("Login ID already exists");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        loginId: formData.loginId.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      toast.success("Admin registered successfully");
      navigate("/admin/login");
    } catch (err) {
      console.warn("Signup error:", err);
      toast.error("Registration failed");
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
            Admin Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <input
              name="loginId"
              type="text"
              placeholder="Login ID"
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            {errors.loginId && (
              <span className="text-red-500 text-sm">{errors.loginId}</span>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="border-t pt-4">
            Already have an account?{" "}
            <Link
              to="/admin/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
