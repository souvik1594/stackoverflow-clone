"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth"; // Update this path if your authStore is in a different location

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    //collect data
    const formData = new FormData(event.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    //validate data

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    //call the store
    setIsLoading(true);
    setError("");

    const response = await createAccount(
      `${firstName} ${lastName}`,
      email,
      password
    );

    if (response.error) {
      setError(response.error?.message ?? "An unknown error occurred");
    } else {
      const loginResponse = await login(email, password);
      if (loginResponse.error) {
        setError(loginResponse.error?.message ?? "An unknown error occurred");
      }
    }
    setIsLoading(false);
  };

  return (
    <div>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4"></form>
    </div>
  );
}

export default RegisterPage;
