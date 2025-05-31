import React from "react";
import { LoginForm } from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("token", token);

  useEffect(() => {
    if (token) {
      //return to home page
      navigate("/");
    }
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
