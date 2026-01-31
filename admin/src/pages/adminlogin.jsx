import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminLoginApi } from "../utils/API/authapi";
import "./Login.css";

const AdminLogin = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await adminLoginApi({
        loginId,
        password,
        role: "admin",
      });

      const { token, ...user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      toast.success("Admin logged in");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        placeholder="Admin Login ID"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Admin Login</button>
    </form>
  );
};

export default AdminLogin;
