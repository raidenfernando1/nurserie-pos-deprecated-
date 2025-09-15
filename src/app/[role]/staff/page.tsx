"use client";

export default function Staff() {
  const TestCreateUser = async () => {
    const response = await fetch("/api/admin/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "cashier1",
        password: "StrongPassword123",
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch warehouse");
    return response.json();
  };

  return (
    <>
      <button onClick={() => TestCreateUser()}>Create cashier</button>
      <button>Delete cashier</button>
      <button></button>
    </>
  );
}
