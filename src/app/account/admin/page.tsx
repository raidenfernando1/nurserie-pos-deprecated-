import AdminLogin from "./LoginForm";

export default function Admin() {
  return (
    <main className="flex flex-col items-center justify-center h-full gap-32">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-7xl tracking-tight">nurserie</h1>
        <h2 className=" text-red-500">Administrator</h2>
      </div>
      <AdminLogin />
    </main>
  );
}
