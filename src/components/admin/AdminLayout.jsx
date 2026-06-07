import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;