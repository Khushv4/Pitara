import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3E2723] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3E2723] text-[#FAF8F5] p-8 hidden md:block">
        <h2 className="font-serif text-2xl mb-10">Pitara Admin</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className="block opacity-70 hover:opacity-100 transition-opacity">
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;