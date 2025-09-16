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

  const fetchCashiers = async () => {
    const response = await fetch("/api/admin/staff");
    const data = await response.json();
    return data;
  };

  return (
    <>
      <button onClick={() => TestCreateUser()}>Create cashier</button>
      <button onClick={() => fetchCashiers()}>test cashier</button>

      <button>Delete cashier</button>
      <button></button>
    </>
  );
}
