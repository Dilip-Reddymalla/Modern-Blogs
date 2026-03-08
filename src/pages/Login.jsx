import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/ui/FormInput";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      if (response.data && response.data.user) {
        login(response.data.user);
        toast.success("Login Successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 8rem)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2.5rem",
          borderRadius: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            color: "var(--color-primary)",
          }}
        >
          <LogIn size={40} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Enter your details to access your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <FormInput
            id="username"
            label="Username or Email"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />

          <FormInput
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Sign In
          </Button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--color-primary)", fontWeight: 600 }}
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
