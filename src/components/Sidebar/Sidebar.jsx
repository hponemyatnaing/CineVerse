import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🎬 Admin Panel</h2>

      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/movies">Movies</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </div>
  );
}

export default Sidebar;
