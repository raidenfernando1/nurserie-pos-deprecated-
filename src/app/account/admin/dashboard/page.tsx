import Navbar from "./navbar";
import Card from "./card";

const adminList = [
  { name: "Analytics", path: "/account/admin/dashboard/analytics" },
  { name: "Inventory", path: "/account/admin/dashboard/inventory" },
  { name: "Settings", path: "/account/admin/dashboard/settings" },
  { name: "Staff", path: "/account/admin/dashboard/users" },
];

export default function Dashboard() {
  return (
    <>
      <main className="grid grid-cols-3 gap-8 p-12">
        {adminList.map(({ name, path }, index) => {
          return <Card key={index} name={name} path={path} />;
        })}
      </main>
    </>
  );
}
