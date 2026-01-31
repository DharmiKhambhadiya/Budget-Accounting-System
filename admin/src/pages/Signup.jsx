import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminRegisterApi } from "../utils/API/authapi";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin", // fixed role
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.loginId.trim()) {
      newErrors.loginId = "Login ID is required";
    } else if (!/^[a-zA-Z0-9]{6,12}$/.test(formData.loginId)) {
      newErrors.loginId =
        "Login ID must be 6–12 characters, letters & numbers only (no spaces)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================
     INPUT CHANGE
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        loginId: formData.loginId.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "admin",
      };
      console.log("Signup payload:", payload);

      const res = await adminRegisterApi(payload);

      toast.success("Admin registered successfully");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-logo">Shiv Furniture</h1>
        <p className="signup-subtitle">Admin Registration</p>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}

          {/* Login ID */}
          <input
            type="text"
            name="loginId"
            placeholder="Login ID"
            value={formData.loginId}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.loginId && (
            <span className="form-error">{errors.loginId}</span>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}

          {/* Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <span className="form-error">{errors.password}</span>
          )}

          {/* Confirm Password */}
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
