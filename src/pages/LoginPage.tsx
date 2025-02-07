import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { Button, TextField, Container, Typography, Box } from "@mui/material";

import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (name: string, email: string) => {
    try {
      await login(name, email);
      authLogin();
      navigate("/search");
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <LoginForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default LoginPage;
