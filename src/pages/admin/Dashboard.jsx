import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDashboardStats } from "../../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, featured: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-serif font-bold mb-12">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {[ 
          { label: "Products", val: stats.products },
          { label: "Categories", val: stats.categories },
          { label: "Featured", val: stats.featured }
        ].map((item) => (
          <div key={item.label} className="bg-white p-8 border border-[#EAE3D5] shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">{item.label}</p>
            <h2 className="text-5xl font-sans font-medium mt-4">{item.val}</h2>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;