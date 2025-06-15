"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/auth";

function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Collect data
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    //validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setIsLoading(true);

    const loginResponse = await login(email, password);

    if (loginResponse.error) {
      setError(loginResponse.error?.message ?? "An unknown error occurred");
      return;
    }
    setIsLoading(() => false);
  };
  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      Login Page
    </div>
  );
}

export default LoginPage;
