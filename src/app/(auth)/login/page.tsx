import LoginForm from "@/features/auth/components/login";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

async function Login() {
    await requireUnauth();
  return (
    <>
      <LoginForm />
    </>
  );
}

export default Login;
