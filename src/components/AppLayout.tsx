import { NavLink, Outlet } from "react-router-dom";

function NavItem({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-8">
      <div className="w-full max-w-3xl">
        <header className="flex items-center justify-between mb-6">
          <div>
            <div className="text-lg font-semibold text-gray-900">CreatorBriefs</div>
            <div className="text-xs text-gray-500">Prototype</div>
          </div>

          <nav className="flex gap-2">
            <NavItem to="/" label="Dashboard" />
            <NavItem to="/ideas" label="Ideas" />
            <NavItem to="/briefs" label="Briefs" />
            <NavItem to="/settings" label="Settings" />
          </nav>
        </header>

        <main className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}