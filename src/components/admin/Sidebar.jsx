import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function Sidebar() {
  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Add Product",
      path: "/admin/products/new",
    },
    {
      name: "Categories",
      path: "/admin/categories",
    },
  ];

  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href =
      "/admin/login";
  };

  return (
    <aside
      className="
      w-72
      min-h-screen
      bg-white
      border-r
      flex
      flex-col
    "
    >
      <div className="p-8">
        <h1
          className="
          text-2xl
          font-bold
          tracking-widest
          text-[#1A531A]
        "
        >
          PITARA
        </h1>
      </div>

      <nav className="px-4 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `
              block
              px-5
              py-3
              rounded-xl
              mb-2
              transition
              ${
                isActive
                  ? "bg-[#1A531A] text-white"
                  : "hover:bg-gray-100"
              }
            `
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="
          w-full
          py-3
          rounded-xl
          bg-red-50
          text-red-600
          hover:bg-red-100
          transition
        "
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;